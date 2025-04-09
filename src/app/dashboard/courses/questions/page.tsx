'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { questions } from '@/data/questions'
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import jsPDF from 'jspdf'
import { useUser } from '@clerk/nextjs'

const Questions = () => {
  const { user, isSignedIn, isLoaded } = useUser()
  const [username, setUsername] = useState('')
  const [storedName, setStoredName] = useState('')
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showQuiz, setShowQuiz] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [assessmentCount, setAssessmentCount] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Only run this code in the client side
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
      // Only run this code in the client side
      localStorage.setItem('vc_quiz_answers', JSON.stringify(answers))
      localStorage.setItem('vc_quiz_current', String(current))
    }
  }, [answers, current, assessmentCount]) // Run this when answers or current changes

  const handleStart = () => {
    setStoredName(username)
    if (typeof window !== 'undefined') {
      localStorage.setItem('vc_quiz_name', username)
    }
    setShowQuiz(true)
  }

  const handleOption = (letter: string) => {
    setAnswers({ ...answers, [questions[current].number]: letter })
  }

  const handleSubmit = () => {
    setSubmitted(true)
    const correct = questions.filter(
      (q) => answers[q.number] === q.answer
    ).length

    // Increment assessment count
    const newAssessmentCount = assessmentCount + 1
    setAssessmentCount(newAssessmentCount)
    if (correct >= 1) {
      const doc = new jsPDF()
      doc.text(`Certificate of Completion`, 20, 30)
      doc.text(`Awarded to: ${storedName}`, 20, 50)
      doc.text(`Score: ${correct}/100`, 20, 70)
      doc.save(`${storedName}_certificate.pdf`)
    }
  }
  const handleRetake = () => {
    // Reset quiz state to retake the quiz
    setAnswers({})
    setCurrent(0)
    setSubmitted(false)
    setShowQuiz(true)
    // Reload the page to reset the state
    window.location.reload()
  }
  const q = questions[current]
  const selected = answers[q.number]

  if (loading) {
    // Show a loading state while the component is loading
    return <div>Loading...</div>
  }

  if (!storedName && !showQuiz) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
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
      </div>
    )
  }
  const correct = questions.filter((q) => answers[q.number] === q.answer).length
  return (
    <Dialog open={storedName ? !showQuiz || submitted : showQuiz || submitted}>
      <DialogContent className='w-full max-w-[90vw] max-h-[90vh] overflow-auto py-10'>
        {!submitted ? (
          <div className='space-y-4'>
            <DialogHeader>
              <h2 className='text-2xl font-bold'>
                {q.number < 100
                  ? 'TYPE A'
                  : q.number >= 101 && q.number < 201
                  ? 'TYPE B'
                  : q.number >= 201 && q.number < 301
                  ? 'TYPE C'
                  : 'TYPE D'}
              </h2>
              <h2 className='text-lg font-semibold'>Question {q.number}</h2>
              <p>{q.question}</p>
            </DialogHeader>
            <div className='space-y-2'>
              {Object.entries(q.options).map(([key, text]) => (
                <Button
                  key={key}
                  variant={selected === key ? 'default' : 'outline'}
                  className='w-full justify-start'
                  onClick={() => handleOption(key)}
                >
                  {key}. {text}
                </Button>
              ))}
            </div>
            <div className='flex justify-between'>
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
                  {q.number === 100
                    ? 'Start Type B Questions'
                    : q.number === 200
                    ? 'Start Type C Questions'
                    : q.number === 300
                    ? 'Start Type D Questions'
                    : 'Next'}
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={!selected}>
                  Submit
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className='text-center space-y-4'>
            <h2 className='text-xl font-semibold'>Quiz Completed!</h2>
            <p>Thank you, {storedName}. Your responses have been recorded.</p>
            <p>
              Score: {correct} / {questions.length}
            </p>
            {correct >= 1 ? (
              <p>🎉 You passed! Certificate has been downloaded.</p>
            ) : (
              <p>
                😢 You did not meet the passing mark. Please retake the quiz.
              </p>
            )}
            <p>You have taken this quiz {assessmentCount} times.</p>
            {correct < 1 ? (
              <Button onClick={handleRetake} className='w-full'>
                Retake Assessment
              </Button>
            ) : null}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default Questions
