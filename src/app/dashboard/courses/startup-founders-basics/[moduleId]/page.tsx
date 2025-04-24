'use client'

import { Separator } from '@/components/ui/separator'
import { modules } from '@/data/modules'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { useModuleProgress } from '@/context/ModuleProgressContext'
import { useState } from 'react'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useEffect } from 'react'
import ReactConfetti from 'react-confetti'
import { motion } from 'framer-motion'
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
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
    <motion.div
      className='p-4 relative'
      variants={containerVariants}
      initial='hidden'
      animate='visible'
    >
      {showConfetti && <ReactConfetti recycle={false} numberOfPieces={500} />}
      {/* Alerts */}
      {showCompletionAlert && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
        >
          <Alert className='fixed top-4 right-4 w-auto max-w-md bg-green-50 border-green-200 z-50'>
            <CheckCircle className='h-4 w-4 text-green-500' />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>
              Module completed successfully. Your progress has been saved.
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {showRestrictedAlert && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
        >
          <Alert className='fixed top-4 right-4 w-auto max-w-md bg-amber-50 border-amber-200 z-50'>
            <AlertCircle className='h-4 w-4 text-amber-500' />
            <AlertTitle>Access Restricted</AlertTitle>
            <AlertDescription>
              You need to complete previous modules first before accessing this
              one.
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
      {/* Header Section */}
      <motion.div variants={itemVariants}>
        <h1 className='text-xl font-semibold'>{moduleData.title}</h1>
        <div className='flex flex-wrap gap-4 mt-2'>
          <motion.p variants={itemVariants}>
            <span className='font-medium'>Duration:</span> {moduleData.duration}
          </motion.p>
          <motion.p variants={itemVariants}>
            <span className='font-medium'>Format:</span> {moduleData.Format}
          </motion.p>
          <motion.p variants={itemVariants}>
            <span className='font-medium'>Level:</span> {moduleData.level}
          </motion.p>
          {isCompleted && (
            <motion.div
              className='flex items-center text-green-500 ml-auto'
              variants={itemVariants}
            >
              <CheckCircle className='h-4 w-4 mr-1' />
              <span>Completed</span>
            </motion.div>
          )}
        </div>
      </motion.div>
      <Separator className='my-4' />
      {/* Description Section */}
      <motion.div variants={itemVariants}>
        <p>
          <span className='font-medium'>Description:</span>
          {moduleData.description}
        </p>
      </motion.div>

      {/* Key Questions Section */}
      <motion.div variants={itemVariants}>
        <p className='font-bold mt-2'>Key Questions We&apos;ll Answer:</p>
        <motion.ul className='list-disc pl-5'>
          {moduleData?.keyQuestions?.map((item, index) => (
            <motion.li key={index} variants={listItemVariants} custom={index}>
              {item}
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
      <Separator className='my-4' />
      {/* Case Story Section */}
      <motion.div variants={itemVariants}>
        <h1 className='mt-4 text-black font-semibold text-center text-xl'>
          CASE STORY
        </h1>
        <motion.div className='mt-4'>
          {Object.keys(moduleData.content).map(
            (key, index) =>
              key !== 'heading' && (
                <motion.p
                  key={index}
                  className='mb-4'
                  variants={itemVariants}
                  custom={index}
                >
                  {moduleData.content[key as keyof typeof moduleData.content]}
                </motion.p>
              )
          )}
        </motion.div>
      </motion.div>
      <Separator className='my-4' />
      {/* Lessons Section */}
      <motion.div variants={itemVariants}>
        {moduleData?.lessons?.map((item, index) => (
          <motion.div
            className='mt-5'
            key={index}
            variants={itemVariants}
            custom={index}
          >
            <motion.p variants={listItemVariants}>{item?.title}</motion.p>
            <motion.p variants={listItemVariants}>{item?.desc}</motion.p>
            <motion.p variants={listItemVariants}>{item?.fullDesc}</motion.p>
            <br />
            <motion.ul className='list-disc pl-5'>
              {item?.items?.map((it, index) => (
                <motion.li key={index} variants={listItemVariants}>
                  {it}
                </motion.li>
              ))}
            </motion.ul>

            <motion.p className='mt-3 font-medium' variants={listItemVariants}>
              Case Study
            </motion.p>
            <motion.ul className='list-disc pl-5'>
              {item?.example?.map((it, index) => (
                <motion.li key={index} variants={listItemVariants}>
                  {it}
                </motion.li>
              ))}
            </motion.ul>

            <motion.p className='mt-3 font-medium' variants={listItemVariants}>
              Reflection
            </motion.p>
            <motion.ul className='list-disc pl-5'>
              {item?.assignment?.map((it, index) => (
                <motion.li key={index} variants={listItemVariants}>
                  {it}
                </motion.li>
              ))}
            </motion.ul>
            <Separator className='my-4' />
          </motion.div>
        ))}
      </motion.div>

      {/* Additional Resources Section */}
      <motion.div variants={itemVariants}>
        <motion.ul className='list-disc pl-5'>
          {moduleData?.addResouces?.map((item, index) =>
            index === 0 ? (
              <motion.p
                className='font-medium'
                key={index}
                variants={listItemVariants}
              >
                {item}
              </motion.p>
            ) : (
              <motion.li key={index} variants={listItemVariants}>
                {item}
              </motion.li>
            )
          )}
        </motion.ul>
      </motion.div>

      <Separator className='my-4' />

      {/* Discussion Prompts Section */}
      <motion.div variants={itemVariants}>
        <motion.ul className='list-disc pl-5'>
          {moduleData?.disscForPrompt?.map((item, index) =>
            index === 0 ? (
              <motion.p
                className='font-medium'
                key={index}
                variants={listItemVariants}
              >
                {item}
              </motion.p>
            ) : (
              <motion.li key={index} variants={listItemVariants}>
                {item}
              </motion.li>
            )
          )}
        </motion.ul>
      </motion.div>

      {/* Navigation Buttons */}
      <motion.div
        className='flex flex-wrap gap-4 mt-8 items-center justify-center'
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
      >
        <motion.button
          onClick={previousModule}
          className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors'
          disabled={currentModuleIndex === 0}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Previous
        </motion.button>

        {!isCompleted && (
          <motion.button
            onClick={handleCompleteModule}
            className='px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <CheckCircle className='mr-2 h-4 w-4' />
            Confirm Completion
          </motion.button>
        )}

        <motion.button
          onClick={nextModule}
          className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors'
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {currentModuleIndex === modules.length - 1
            ? 'Take Assessments'
            : 'Next'}
        </motion.button>
      </motion.div>
    </motion.div>
  )
}