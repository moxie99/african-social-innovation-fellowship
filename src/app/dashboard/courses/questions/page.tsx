'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { questions as fullArray } from '@/data/questions'
import React, { useEffect, useMemo, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import jsPDF from 'jspdf'
import { getRandomQuestionsRenumbered } from '@/helpers/randomQuestions'
import { motion } from 'framer-motion'
import Confetti from 'react-confetti'
import useWindowSize from 'react-use/lib/useWindowSize'
import { useRouter } from 'next/navigation'
import { Progress } from '@/components/ui/progress'
import { CircleCheck } from 'lucide-react'

const Questions = () => {
  const [username, setUsername] = useState('')
  const [storedName, setStoredName] = useState('')
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showQuiz, setShowQuiz] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [assessmentCount, setAssessmentCount] = useState(0)

  const router = useRouter()
  const { width, height } = useWindowSize()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem('vc_quiz_name')
      const savedAnswers = localStorage.getItem('vc_quiz_answers')
      const savedCurrent = localStorage.getItem('vc_quiz_current')
      const savedAssessmentCount = localStorage.getItem('vc_quiz_count')

      if (savedName) setStoredName(savedName)
      if (savedAnswers) setAnswers(JSON.parse(savedAnswers))
      if (savedCurrent) setCurrent(Number(savedCurrent))
      if (savedAssessmentCount) setAssessmentCount(Number(savedAssessmentCount))
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vc_quiz_answers', JSON.stringify(answers))
      localStorage.setItem('vc_quiz_current', String(current))
    }
  }, [answers, current, assessmentCount])

  // Add timer state
  const [timeLeft, setTimeLeft] = useState(60 * 60) // 60 minutes in seconds

  useEffect(() => {
    if (!submitted && storedName && showQuiz) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            handleSubmit() // Auto-submit when time runs out
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [submitted, storedName, showQuiz])
  const handleStart = () => {
    setStoredName(username)
    if (typeof window !== 'undefined') {
      localStorage.setItem('vc_quiz_name', username)
      // Refresh the page after setting the name
      window.location.reload()
    }
  }

  // Use useMemo to ensure questions array doesn't change on re-renders
  const questions = useMemo(
    () => getRandomQuestionsRenumbered(fullArray, 100),
    []
  )

  const handleOption = (letter: string) => {
    setAnswers({ ...answers, [questions[current].number]: letter })
  }

  const handleSubmit = () => {
    setSubmitted(true)
    const correct = questions.filter(
      (q) => answers[q.number] === q.answer
    ).length

    const newAssessmentCount = assessmentCount + 1
    setAssessmentCount(newAssessmentCount)
    if (correct >= 70) {
      const doc = new jsPDF()
      doc.text(`Certificate of Completion`, 20, 30)
      doc.text(`Awarded to: ${storedName}`, 20, 50)
      doc.text(`Score: ${correct}/100`, 20, 70)
      doc.save(`${storedName}_certificate.pdf`)
    }
    router.push('/dashboard/courses/certifcate')
  }

  const handleRetake = () => {
    setAnswers({})
    setCurrent(0)
    setSubmitted(false)
    setShowQuiz(true)
    window.location.reload()
  }

  const q = questions[current]
  const selected = answers[q.number]

  // Calculate percentage of questions answered
  const answeredCount = Object.keys(answers).length
  const progressPercentage = (answeredCount / questions.length) * 100
  // Animation variants for questions
  const questionVariants = {
    initial: { x: 50, opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
    exit: { x: -50, opacity: 0, transition: { duration: 0.3 } },
  }

  // Animation variants for options with stagger effect
  const optionsContainerVariants = {
    animate: {
      transition: { staggerChildren: 0.1 },
    },
  }

  const optionVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.3 } },
  }
  // Format time function
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!storedName && !showQuiz) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='min-h-screen flex items-center justify-center'
      >
        <div className='space-y-4 p-6 border shadow rounded-xl'>
          <h1 className='text-xl font-semibold'>
            Enter your name to begin quiz:
          </h1>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder='Your name'
          />
          <Button onClick={handleStart} disabled={!username}>
            Start Quiz
          </Button>
        </div>
      </motion.div>
    )
  }

  const correct = questions.filter((q) => answers[q.number] === q.answer).length
  return (
    <Dialog open={storedName ? !showQuiz || submitted : showQuiz || submitted}>
      <DialogContent className='w-[95%] md:w-[85%] lg:w-[75%] max-w-4xl mx-auto min-h-[200px] max-h-[85vh] overflow-y-auto p-4 md:p-6 lg:p-8'>
        {!submitted ? (
          <motion.div
            key={current}
            variants={questionVariants}
            initial='initial'
            animate='animate'
            exit='exit'
            className='space-y-4'
          >
            <div className='mb-4'>
              <div className='flex justify-between items-center mb-2'>
                <div className='flex items-center gap-2'>
                  <CircleCheck className='h-5 w-5 text-primary' />
                  <span className='text-sm font-medium'>
                    Time Remaining: {formatTime(timeLeft)}
                  </span>
                </div>
                <span className='text-sm font-medium'>
                  {answeredCount}/{questions.length} completed
                </span>
              </div>
              <Progress value={progressPercentage} className='h-2' />
            </div>

            <DialogHeader>
              <h2 className='text-2xl font-bold'>
                {q.number < questions.length ? 'ASSESSMENT' : 'FINAL QUESTION'}
              </h2>
              <h2 className='text-lg font-semibold'>Question {q.number}</h2>
              <p className='text-base md:text-lg whitespace-pre-wrap'>
                {q.question}
              </p>
            </DialogHeader>
            <motion.div
              className='space-y-2'
              variants={optionsContainerVariants}
              initial='initial'
              animate='animate'
            >
              {Object.entries(q.options).map(([key, text]) => (
                <motion.div key={key} variants={optionVariants}>
                  <Button
                    variant={selected === key ? 'default' : 'outline'}
                    className='w-full justify-start text-left whitespace-normal h-auto py-3'
                    onClick={() => handleOption(key)}
                  >
                    {key}. {text}
                  </Button>
                </motion.div>
              ))}
            </motion.div>
            <div className='flex justify-between mt-6'>
              <Button
                onClick={() => setCurrent(current - 1)}
                disabled={current === 0}
                variant='secondary'
              >
                Previous
              </Button>
              {current < questions.length - 1 ? (
                <Button
                  onClick={() => setCurrent(current + 1)}
                  disabled={!selected}
                >
                  {q.number === 100 ? 'SUBMIT' : 'Next'}
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={!selected}>
                  Submit
                </Button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className='text-center space-y-4'
          >
            <Confetti width={width} height={height} recycle={false} />
            <h2 className='text-xl font-semibold'>Quiz Completed!</h2>
            <p>Thank you, {storedName}. Your responses have been recorded.</p>
            <p>
              Score: {correct} / {questions.length}
            </p>
            {correct >= 70 ? (
              <p>🎉 You passed! Certificate has been downloaded.</p>
            ) : (
              <p>
                😢 You did not meet the passing mark. Please retake the quiz.
              </p>
            )}
            <p>You have taken this quiz {assessmentCount} times.</p>
            {correct < 70 ? (
              <Button onClick={handleRetake} className='w-full'>
                Retake Assessment
              </Button>
            ) : null}
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default Questions
