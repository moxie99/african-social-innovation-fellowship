/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { auth, loginWithEmail, logoutUser } from '@/lib/auth'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Search, LogOut } from 'lucide-react'
import { getAllUsers } from '@/lib/operations'
import { UserData } from '@/types/type'
import React, { useEffect, useState } from 'react'

const Admin = () => {
  const [allUsers, setAllUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // Handle authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Fetch all users from the database
  const fetchAllUsers = async () => {
    try {
      const users = await getAllUsers()
      setAllUsers(users)
    } catch (error) {
      console.error('Error fetching all users:', error)
    }
  }

  // Load all users when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchAllUsers()
    }
  }, [isAuthenticated])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await loginWithEmail(email, password)
    } catch (error: any) {
      console.log('ppppp', error)
      setError('Invalid email or password')
    }
  }

  const handleLogout = async () => {
    try {
      await logoutUser()
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  // Filter users based on search term
  const filteredUsers = allUsers.filter((user) =>
    Object.values(user).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

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
  if (!isAuthenticated) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-50'>
        <div className='w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg'>
          <h2 className='text-2xl font-bold text-center text-gray-900'>
            Admin Login
          </h2>
          {error && (
            <div className='p-3 text-sm text-red-600 bg-red-100 rounded-md'>
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Email
              </label>
              <Input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='mt-1'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Password
              </label>
              <Input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='mt-1'
              />
            </div>
            <button
              type='submit'
              className='w-full px-4 py-2 text-white bg-[#db745d] rounded-md hover:bg-[#db4b2c] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className='p-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className='flex items-center gap-2 px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700'
        >
          <LogOut className='w-4 h-4' />
          Logout
        </button>
      </div>

      <div className='mb-6 relative'>
        <Search className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
        <Input
          type='search'
          placeholder='Search users...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='pl-10'
        />
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Certificate</TableHead>
              <TableHead>Exam Code</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className='font-medium'>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.score}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user?.score >= 70
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user?.score >= 70 ? 'Passed' : 'Failed'}
                  </span>
                </TableCell>
                <TableCell>
                  {user.certificateDownloaded ? (
                    <span className='text-green-600'>Downloaded</span>
                  ) : (
                    <span className='text-gray-400'>Not Downloaded</span>
                  )}
                </TableCell>
                <TableCell>{user.examCode || 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default Admin
