import type { Metadata } from 'next'
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ModuleProgressProvider } from '@/context/ModuleProgressContext'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'ASIF',
  description:
    "Unlock Your Entrepreneurial Potential with ASIF's Startup Founder's Basic Course! Gain essential knowledge and skills for launching a successful startup through this expert-designed online program. Earn a certificate upon completion and connect with a vibrant community of innovators. Tailored for young African entrepreneurs, this course covers idea validation, business model development, fundraising, marketing, and operational excellence. Enroll now to transform your startup dreams into reality!",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ModuleProgressProvider>
            <header className='flex justify-end items-center p-4 gap-4 h-16'>
              <SignedOut>
                <SignInButton />
                <SignUpButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </header>
            {children}
          </ModuleProgressProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
