'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import CertificateGenerator from '@/helpers/CertificateGenerator'
import { useEffect, useState } from 'react'

const Certificate = () => {
  const [holderName, setHolderName] = useState('')
  const [inputName, setInputName] = useState('')
  const signatureUrl = '/assets/signature.png'

  useEffect(() => {
    // Only run localStorage access on the client
    const savedName = localStorage.getItem('vc_quiz_name')
    if (savedName) {
      setHolderName(savedName)
      setInputName(savedName)
    }
  }, [])

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setHolderName(inputName)
    localStorage.setItem('vc_quiz_name', inputName)
  }

  return (
    <div className='p-4 md:p-8 max-w-screen-xl mx-auto'>
      <h1 className='text-3xl font-bold text-center mb-6'>
        Certificate of Completion
      </h1>

      <div className='max-w-md mx-auto mb-8'>
        <form onSubmit={handleNameSubmit} className='flex flex-col gap-2'>
          <Input
            type='text'
            placeholder='Certificate Holder Name'
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            className='mb-2'
          />
          <Button type='submit' className='w-full' disabled={!inputName.trim()}>
            {holderName ? 'Update Name' : 'Generate Certificate'}
          </Button>
        </form>
      </div>

      {holderName && (
        <CertificateGenerator
          holderName={holderName}
          signatureUrl={signatureUrl}
        />
      )}
    </div>
  )
}

export default Certificate
