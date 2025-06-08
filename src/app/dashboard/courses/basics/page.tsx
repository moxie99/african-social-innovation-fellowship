'use client'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@/components/ui/dialog'
import { getRandomQuestionsRenumbered } from '@/helpers/randomQuestions'
import { UserData } from '@/types/type'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { CheckCircle, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import useWindowSize from 'react-use/lib/useWindowSize'
import { questions as fullArray } from '@/data/questions'
import { getAllUsers, sanitizeKey, setData } from '@/lib/operations'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import Confetti from 'react-confetti'
const Basics = () => {
  const { user } = useUser()
  const [username, setUsername] = useState('')
  const [storedName, setStoredName] = useState('')
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showQuiz, setShowQuiz] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [assessmentCount, setAssessmentCount] = useState(0)
  const [allUsers, setAllUsers] = useState<UserData[]>([])
  const [message, setMessage] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  // Timer state - 60 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(3 * 60)

  const router = useRouter()
  const { width, height } = useWindowSize()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem('vc_quiz_name')
      const savedAnswers = localStorage.getItem('vc_quiz_answers')
      const savedCurrent = localStorage.getItem('vc_quiz_current')
      const savedAssessmentCount = localStorage.getItem('vc_quiz_count')
      const savedTimeLeft = localStorage.getItem('vc_quiz_time_left')

      if (savedName) {
        setStoredName(savedName)
        setShowQuiz(true) // Important: Show quiz if we have a name
      }
      if (savedAnswers) setAnswers(JSON.parse(savedAnswers))
      if (savedCurrent) setCurrent(Number(savedCurrent))
      if (savedAssessmentCount) setAssessmentCount(Number(savedAssessmentCount))
      if (savedTimeLeft) setTimeLeft(Number(savedTimeLeft))
      else setTimeLeft(3 * 60) // Reset to 60 minutes if no saved time

      setLoading(false)
    }
  }, [])

  // Save answers, current question and timer to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && storedName) {
      localStorage.setItem('vc_quiz_answers', JSON.stringify(answers))
      localStorage.setItem('vc_quiz_current', String(current))
      localStorage.setItem('vc_quiz_time_left', String(timeLeft))
    }
  }, [answers, current, timeLeft, storedName])

  // Timer countdown effect
  useEffect(() => {
    // Only run timer when quiz is active
    if (!submitted && storedName && showQuiz) {
      const timerInterval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerInterval)
            handleSubmit() // Auto-submit when time runs out
            return 0
          }
          return prevTime - 1
        })
      }, 1000)

      // Cleanup timer on unmount or when quiz is submitted
      return () => clearInterval(timerInterval)
    }
  }, [submitted, storedName, showQuiz])

  const handleStart = () => {
    setStoredName(username)
    setShowQuiz(true)
    setTimeLeft(3 * 60) // Reset timer to 60 minutes

    if (typeof window !== 'undefined') {
      localStorage.setItem('vc_quiz_name', username)
      localStorage.setItem('vc_quiz_time_left', String(3 * 60))
    }
  }

  // Use useMemo to ensure questions array doesn't change on re-renders
  const questions = useMemo(
    () => getRandomQuestionsRenumbered(fullArray, 30),
    []
  )

  const q = questions[current]
  const selected = q && answers[q.number]
  const correct = questions.filter((q) => answers[q.number] === q.answer).length
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

  const handleOption = (letter: string) => {
    setAnswers({ ...answers, [questions[current].number]: letter })
  }

  const handleSubmit = () => {
    setSubmitted(true)
    const newAssessmentCount = assessmentCount + 1
    setAssessmentCount(newAssessmentCount)

    if (typeof window !== 'undefined') {
      localStorage.setItem('vc_quiz_count', String(newAssessmentCount))
    }
  }

  const handleSetData = async () => {
    const status = correct >= 26 ? 'passed' : 'failed'
    try {
      const sanitizedName = sanitizeKey(storedName)
      const data: UserData = {
        name: storedName,
        email: user?.primaryEmailAddress?.emailAddress || '',
        score: correct,
        totalQuestions: questions.length,
        status,
        attempts: assessmentCount + 1,
        submittedAt: new Date().toISOString(),
      }
      await setData(`quizResults/${sanitizedName}`, data)
      setStatus('Success')
      setMessage('Your data saved successfully')
    } catch (error) {
      console.error('Error creating user:', error)
      setStatus('error')
      setMessage('Error saving your data')
    } finally {
      setLoading(false)
    }
  }
  const handleRetake = async () => {
    const emailExists = allUsers.some(
      (item) => item.email === user?.primaryEmailAddress?.emailAddress
    )
    if (!emailExists) handleSetData()
    if (correct >= 26) {
      router.push('/')
    } else {
      // Reset quiz state
      setStatus('error')
      setMessage("It's good you are trying out again")
      setAnswers({})
      setCurrent(0)
      setSubmitted(false)
      if (typeof window !== 'undefined') {
        localStorage.setItem('vc_quiz_answers', JSON.stringify({}))
        localStorage.setItem('vc_had_assessment', 'true')
        localStorage.setItem('vc_quiz_current', '0')
        localStorage.setItem('vc_quiz_time_left', String(3 * 60))
        localStorage.setItem("vc_quiz_name","")
      }
      router.push("/")
    }
  }

  // Fetch all users from the database
  const fetchAllUsers = async () => {
    setLoading(true)
    try {
      const users = await getAllUsers()
      setAllUsers(users)
    } catch (error) {
      console.error('Error fetching all users:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load all users when component mounts
  useEffect(() => {
    fetchAllUsers()
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds
        .toString()
        .padStart(2, '0')}`
    }

    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto'></div>
          <p className='mt-4 text-lg'>Loading quiz...</p>
        </div>
      </div>
    )
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
  return (
    <>
      {status && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
        >
          <Alert className='fixed top-4 right-4 w-auto max-w-md bg-green-50 border-green-200 z-50'>
            <CheckCircle
              className={`h-4 w-4 ${
                status === 'Success'
                  ? 'text-green-500'
                  : status === 'Error'
                  ? 'text-red-500'
                  : ''
              }`}
            />
            <AlertTitle>
              {status === 'Success' ? 'Success!' : 'Error'}{' '}
            </AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        </motion.div>
      )}
      <Dialog open={submitted || (!!storedName && showQuiz)}>
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
              <div className='mb-4 mt-3'>
                <div className='flex justify-between items-center mb-2'>
                  <div className='flex items-center gap-2'>
                    <Clock className='h-5 w-5 text-primary' />
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

              {q && (
                <>
                  <DialogHeader>
                    <h2 className='text-2xl font-bold'>
                      {q.number < questions.length
                        ? 'ASSESSMENT'
                        : 'FINAL QUESTION'}
                    </h2>
                    <h2 className='text-lg font-semibold'>
                      Question {q.number}
                    </h2>
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
                    {q.options &&
                      Object.entries(q.options).map(([key, text]) => (
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
                        Next
                      </Button>
                    ) : (
                      <Button onClick={handleSubmit} disabled={!selected}>
                        Submit
                      </Button>
                    )}
                  </div>
                  <DialogFooter className='sm:justify-start'>
                    <DialogClose asChild>
                      <Button
                        onClick={() => {
                          router.push('/')
                        }}
                        type='button'
                        variant='secondary'
                      >
                        Close
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </>
              )}
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
              {correct >= 20 ? (
                <p>
                  🎉 You did well! and can do much better. Please watch this
                  space for our course launch.
                </p>
              ) : (
                <p>
                  😢 You did well but there is still a knowledge gap to fill.
                  Please watch this space for our course launch.
                </p>
              )}
              <p>You have taken this quiz {assessmentCount} times.</p>
              <Button onClick={handleRetake} className='w-full'>
                Go Home
              </Button>
              <Button
                className='w-full'
                onClick={() => {
                  router.push('/')
                }}
              >
                Close
              </Button>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Basics
