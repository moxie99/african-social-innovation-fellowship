import { SignUp } from '@clerk/nextjs'
import React from 'react'

export default function Page() {
  return (
    <div className='w-full h-screen flex items-center justify-center'>
      <SignUp />
    </div>
  )
}
