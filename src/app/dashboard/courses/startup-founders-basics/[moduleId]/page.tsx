'use client'

import { Separator } from '@/components/ui/separator'
import { modules } from '@/data/modules'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { useModuleProgress } from '@/context/ModuleProgressContext'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useEffect } from 'react'
import ReactConfetti from 'react-confetti'
export default function ModulePage() {
  const router = useRouter()
  const params = useParams()
  const moduleId = params.moduleId as string
  const { completedModules, currentModule, completeModule, canAccessModule } =
    useModuleProgress()
  const [showCompletionAlert, setShowCompletionAlert] = useState(false)
  const [showRestrictedAlert, setShowRestrictedAlert] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  // Find the module index from the URL parameter
  const currentModuleIndex = modules.findIndex(
    (module) => module.id.toLowerCase().replace(/\s+/g, '-') === moduleId
  )

  // Get the current module data
  const moduleData = modules[currentModuleIndex]

  // Check if user can access this module
  useEffect(() => {
    if (!canAccessModule(moduleId)) {
      setShowRestrictedAlert(true)
      // Redirect to the current accessible module after a delay
      const timer = setTimeout(() => {
        router.push(
          `/dashboard/courses/startup-founders-basics/${currentModule}`
        )
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [moduleId, canAccessModule, router, currentModule])

  if (!moduleData) {
    return <div>Module not found</div>
  }

  // Function to go to next module
  const nextModule = () => {
    if (currentModuleIndex < modules.length - 1) {
      const nextModuleId = modules[currentModuleIndex + 1].id
        .toLowerCase()
        .replace(/\s+/g, '-')

      if (canAccessModule(nextModuleId)) {
        router.push(
          `/dashboard/courses/startup-founders-basics/${nextModuleId}`
        )
      } else {
        // If can't access next module, show alert first
        setShowRestrictedAlert(true)
        setTimeout(() => setShowRestrictedAlert(false), 3000)
      }
    } else {
      // Show confetti and congratulations alert
      setShowConfetti(true)
      setTimeout(() => {
        setShowConfetti(false)
        router.push('/dashboard/courses/questions')
      }, 5000)
    }
  }

  // Function to go to previous module
  const previousModule = () => {
    if (currentModuleIndex > 0) {
      const prevModuleId = modules[currentModuleIndex - 1].id
        .toLowerCase()
        .replace(/\s+/g, '-')
      router.push(`/dashboard/courses/startup-founders-basics/${prevModuleId}`)
    }
  }

  // Handle module completion
  const handleCompleteModule = () => {
    completeModule(moduleId)
    setShowCompletionAlert(true)
    setTimeout(() => setShowCompletionAlert(false), 3000)
  }

  const isCompleted = completedModules.includes(moduleId)

  return (
    <div className='p-4 relative'>
      {showConfetti && <ReactConfetti recycle={false} numberOfPieces={500} />}
      {/* Completion Alert */}
      {showCompletionAlert && (
        <Alert className='fixed top-4 right-4 w-auto max-w-md bg-green-50 border-green-200 z-50 transition-all animate-in slide-in-from-top'>
          <CheckCircle className='h-4 w-4 text-green-500' />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Module completed successfully. Your progress has been saved.
          </AlertDescription>
        </Alert>
      )}

      {/* Restricted Access Alert */}
      {showRestrictedAlert && (
        <Alert className='fixed top-4 right-4 w-auto max-w-md bg-amber-50 border-amber-200 z-50 transition-all animate-in slide-in-from-top'>
          <AlertCircle className='h-4 w-4 text-amber-500' />
          <AlertTitle>Access Restricted</AlertTitle>
          <AlertDescription>
            You need to complete previous modules first before accessing this
            one.
          </AlertDescription>
        </Alert>
      )}

      <h1 className='text-xl font-semibold'>{moduleData.title}</h1>
      <div className='flex flex-wrap gap-4 mt-2'>
        <p>
          <span className='font-medium'>Duration:</span> {moduleData.duration}
        </p>
        <p>
          <span className='font-medium'>Format:</span> {moduleData.Format}
        </p>
        <p>
          <span className='font-medium'>Level:</span> {moduleData.level}
        </p>
        {isCompleted && (
          <div className='flex items-center text-green-500 ml-auto'>
            <CheckCircle className='h-4 w-4 mr-1' />
            <span>Completed</span>
          </div>
        )}
      </div>
      <Separator className='my-4' />
      <p>
        <span className='font-medium'>Description:</span>
        {moduleData.description}
      </p>
      <p className='font-bold mt-2'>Key Questions We&apos;ll Answer:</p>
      <ul className='list-disc pl-5'>
        {moduleData?.keyQuestions?.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <Separator className='my-4' />
      <h1 className='mt-4 text-black font-semibold text-center text-xl'>
        CASE STORY
      </h1>
      <div className='mt-4'>
        {Object.keys(moduleData.content).map(
          (key, index) =>
            key !== 'heading' && (
              <p key={index} className='mb-4'>
                {moduleData.content[key as keyof typeof moduleData.content]}
              </p>
            )
        )}
      </div>
      <Separator className='my-4' />
      <div>
        {moduleData?.lessons?.map((item, index) => (
          <div className='mt-5' key={index}>
            <p>{item?.title}</p>
            <p>{item?.desc}</p>
            <p>{item?.fullDesc}</p>
            <br />
            <ul className='list-disc pl-5'>
              {item?.items?.map((it, index) => (
                <li key={index}>{it}</li>
              ))}
            </ul>
            <p className='mt-3 font-medium'>Case Study</p>
            <ul className='list-disc pl-5'>
              {item?.example?.map((it, index) => (
                <li key={index}>{it}</li>
              ))}
            </ul>
            <p className='mt-3 font-medium'>Reflection</p>
            <ul className='list-disc pl-5'>
              {item?.assignment?.map((it, index) => (
                <li key={index}>{it}</li>
              ))}
            </ul>
            <Separator className='my-4' />
          </div>
        ))}
      </div>
      <div>
        <ul className='list-disc pl-5'>
          {moduleData?.modAss?.map((item, index) =>
            index === 0 ? (
              <p className='font-medium' key={index}>
                {item}
              </p>
            ) : (
              <li key={index}>{item}</li>
            )
          )}
        </ul>
      </div>
      <Separator className='my-4' />
      <div>
        <ul className='list-disc pl-5'>
          {moduleData?.addResouces?.map((item, index) =>
            index === 0 ? (
              <p className='font-medium' key={index}>
                {item}
              </p>
            ) : (
              <li key={index}>{item}</li>
            )
          )}
        </ul>
      </div>
      <Separator className='my-4' />
      <div>
        <ul className='list-disc pl-5'>
          {moduleData?.disscForPrompt?.map((item, index) =>
            index === 0 ? (
              <p className='font-medium' key={index}>
                {item}
              </p>
            ) : (
              <li key={index}>{item}</li>
            )
          )}
        </ul>
      </div>
      <div className='flex flex-wrap gap-4 mt-8 items-center justify-center'>
        <button
          onClick={previousModule}
          className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors'
          disabled={currentModuleIndex === 0}
        >
          Previous
        </button>

        {!isCompleted && (
          <Button
            onClick={handleCompleteModule}
            className='px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors'
          >
            <CheckCircle className='mr-2 h-4 w-4' />
            Confirm Completion
          </Button>
        )}

        <button
          onClick={nextModule}
          className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors'
        >
          {currentModuleIndex === modules.length - 1
            ? 'Take Assessments'
            : 'Next'}
        </button>
      </div>
    </div>
  )
}
