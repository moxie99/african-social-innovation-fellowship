'use client'
import React, { useRef, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import html2canvas from 'html2canvas-pro'
import { jsPDF } from 'jspdf'
import { format } from 'date-fns'
import Image from 'next/image'
import { UserData } from '@/types/type'
import { sanitizeKey, updateData } from '@/lib/operations'

interface CertificateGeneratorProps {
  holderName: string
  signatureUrl?: string
}

const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({
  holderName,
  signatureUrl,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null)
  const [examCode, setExamCode] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const seal = '/assets/seal.png'
  const logo = '/assets/Logo.png'
  const currentDate = format(new Date(), 'MMMM dd, yyyy')
  // Generate the exam code on the client-side only to avoid hydration mismatch
  useEffect(() => {
    setExamCode(Math.random().toString(36).substring(2, 8).toUpperCase())
  }, [])

  const handleUpdateUser = async () => {
    setLoading(true)
    try {
      const sanitizedName = sanitizeKey(holderName)
      const downloadDate = new Date().toISOString()
      const updateData1: Partial<UserData> = {
        certificateDownloaded: true,
        certificateDownloadDate: downloadDate,
        examCode,
      }
      await updateData(`quizResults/${sanitizedName}`, updateData1)
    } catch (error) {
      console.error('Error updating user:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadCertificate = async () => {
    if (!certificateRef.current) return

    try {
      // Create a deep clone of the certificate for html2canvas
      const clonedCertificate = certificateRef.current.cloneNode(
        true
      ) as HTMLElement

      // Apply appropriate styles to the clone to handle oklch colors
      fixColors(clonedCertificate)
      // Temporarily append the clone to the document for html2canvas
      clonedCertificate.style.width = `${certificateRef.current.offsetWidth}px`
      clonedCertificate.style.height = `${certificateRef.current.offsetHeight}px`
      clonedCertificate.style.position = 'absolute'
      clonedCertificate.style.left = '-9999px'
      clonedCertificate.style.top = '0'
      clonedCertificate.style.overflow = 'visible'

      document.body.appendChild(clonedCertificate)
      await new Promise((resolve) => requestAnimationFrame(resolve))

      const canvas = await html2canvas(clonedCertificate, {
        scale: 3,
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff',
        scrollY: 0,
      })

      // Remove the clone after capturing
      document.body.removeChild(clonedCertificate)

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height],
      })

      const imgProps = pdf.getImageProperties(imgData)
      const pdfWidth = canvas.width
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(
        `certificate-${holderName.replace(/\s+/g, '-').toLowerCase()}.pdf`
      )
      handleUpdateUser()
    } catch (error) {
      console.error('Error generating certificate:', error)
    }
  }

  // Helper function to fix oklch colors in the cloned element
  const fixColors = (element: HTMLElement) => {
    // Replace background gradients
    element.style.background = '#f8f9fa'

    // Process all child elements recursively
    const allElements = element.querySelectorAll('*')
    allElements.forEach((el) => {
      const element = el as HTMLElement

      // Replace any color values that might use oklch with safe RGB values
      element.style.color = getComputedStyle(element).color
      element.style.backgroundColor = getComputedStyle(element).backgroundColor

      // Replace border colors
      if (element.style.borderColor) {
        element.style.borderColor = '#000000'
      }

      // Remove any gradients or complex backgrounds
      if (
        element.style.background &&
        (element.style.background.includes('gradient') ||
          element.style.background.includes('oklch'))
      ) {
        element.style.background = '#ffffff'
      }
    })
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
  return (
    <div className='p-8'>
      <Card
        ref={certificateRef}
        className='w-full max-w-[1000px] h-auto aspect-[5/4] mx-auto px-8 bg-white shadow-lg relative overflow-hidden border-t-20 border-l-0 border-r-0 border-red-950'
        id='certificate-element'
      >
        <div className='w-full h-[10px] bg-red-700' />
        {/* Header */}
        <div className='text-center mb-6 text-[#8B0000] text-5xl font-bold font-serif pt-8'>
          CERTIFICATE OF COMPLETION
        </div>

        {/* Main Content */}
        <div className='text-center mt-6'>
          <div className='text-2xl mb-1'>This Certificate Is Presented To</div>
          <div className='text-4xl font-bold border-b-2 border-black inline-block min-w-[60%] pb-1'>
            {holderName || ''}
          </div>
        </div>

        {/* Body Text */}
        <div className='text-center mt-4 px-20'>
          <div className='text-lg leading-relaxed'>
            for a successful completion of the startup founder&apos;s
          </div>
          <div className='text-lg leading-relaxed'>
            basic online course and assessment by the
          </div>
          <div className='text-2xl font-bold my-3'>
            AFRICAN SOCIAL INNOVATION FELLOWSHIP
          </div>
          <div className='text-base mt-4 px-10'>
            This certifies successful mastery of foundational entrepreneurial
            knowledge and strategic insights to launch and scale innovative
            ventures.
          </div>
        </div>

        {/* Footer */}
        <div className='flex flex-wrap justify-between items-center mt-4 px-8'>
          {/* Signature */}
          <div className='mb-4'>
            <div
              className='border-b-2 border-black w-[200px] mb-2 h-[60px] bg-center bg-no-repeat bg-contain'
              style={{
                backgroundImage: signatureUrl ? `url(${signatureUrl})` : 'none',
              }}
            />
            <div className='font-bold'>DENNIS AKIN</div>
            <div>President</div>
          </div>

          <div className='w-[100px] h-[100px] mb-4'>
            {seal && (
              <Image
                alt='seal'
                src={seal}
                height={80}
                width={80}
                unoptimized
                priority
              />
            )}
          </div>

          {/* Date and Exam Code */}
          <div className='mb-4'>
            <div className='mb-4'>
              <div className='font-bold'>DATE: {currentDate}</div>
            </div>
            <div>
              <div className='font-bold'>EXAM. CODE: {examCode}</div>
            </div>
          </div>
          <div className='w-[100px] h-[100px] mb-4'>
            {logo && (
              <Image
                alt='log0'
                src={logo}
                height={80}
                width={80}
                unoptimized
                priority
                className='mt-4'
              />
            )}
          </div>
        </div>
        <div className='w-full h-[10px] bg-red-700 mt-4' />
      </Card>

      {/* Download Button */}
      <div className='text-center mt-8'>
        <Button
          onClick={downloadCertificate}
          size='lg'
          className='bg-red-700 hover:bg-red-800 text-white'
        >
          Download Certificate
        </Button>
      </div>
    </div>
  )
}

export default CertificateGenerator
