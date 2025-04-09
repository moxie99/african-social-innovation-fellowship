'use client'

import { Separator } from '@/components/ui/separator'
import { modules } from '@/data/modules'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

// Define course modules

export default function StartupFoundersBasicsPage() {
  // State to track current module
  const router = useRouter()
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0)

  // Function to go to next module
  const nextModule = () => {
    if (currentModuleIndex < modules.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1)
    } else {
      router.push('/dashboard/courses/questions')
    }
  }

  // Function to go to previous module
  const previousModule = () => {
    if (currentModuleIndex > 0) {
      setCurrentModuleIndex(currentModuleIndex - 1)
    }
  }

  const currentModule = modules[currentModuleIndex]

  return (
    <div className='p-4'>
      <h1 className='text-xl font-semibold'>{currentModule.title}</h1>
      <p>
        <span className='font-medium'>Duration:</span> {currentModule.duration}
      </p>
      <p>
        <span className='font-medium'>Format:</span> {currentModule.Format}
      </p>
      <p>
        <span className='font-medium'>Level:</span> {currentModule.level}
      </p>
      <Separator className='my-4' />
      <p>
        <span className='font-medium'>Description:</span>{' '}
        {currentModule.description}
      </p>
      <p className='font-bold mt-2'>Key Questions We’ll Answer:</p>
      <ul className='list-disc pl-5'>
        {currentModule?.keyQuestions?.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <Separator className='my-4' />
      <h1 className='mt-4 text-black font-semibold text-center text-xl'>
        CASE STORY
      </h1>
      <div className='mt-4'>
        {Object.keys(currentModule.content).map(
          (key, index) =>
            key !== 'heading' && (
              <p key={index} className='mb-4'>
                {/* Make sure to access the content using a key that exists */}
                {
                  currentModule.content[
                    key as keyof typeof currentModule.content
                  ]
                }
              </p>
            )
        )}
      </div>
      <Separator className='my-4' />
      <div>
        {currentModule?.lessons?.map((item, index) => (
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
          {currentModule?.modAss?.map((item, index) =>
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
          {currentModule?.addResouces?.map((item, index) =>
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
          {currentModule?.disscForPrompt?.map((item, index) =>
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
      <div className='flex gap-4 mt-4 items-center justify-center'>
        <button
          onClick={previousModule}
          className='px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50'
          disabled={currentModuleIndex === 0}
        >
          Previous
        </button>
        <button
          onClick={nextModule}
          className='px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50'
        >
          {currentModuleIndex === modules.length - 1
            ? 'Take Assessments'
            : 'Next'}
        </button>
      </div>
    </div>
  )
}
