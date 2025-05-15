/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, set, update, get } from 'firebase/database'
import { database } from './firebase'

// Sanitize keys consistently across the application
export const sanitizeKey = (key: string): string => {
  return key.replace(/[.#$[\]/\s]/g, '_')
}

// Create or set data in the database
export const setData = async (path: string, data: any): Promise<void> => {
  try {
    const dbRef = ref(database, path)
    await set(dbRef, data)
    return Promise.resolve()
  } catch (error) {
    console.error('Error setting data:', error)
    return Promise.reject(error)
  }
}

// Update data in the database
export const updateData = async (path: string, data: any): Promise<void> => {
  try {
    const dbRef = ref(database, path)

    // First, check if the data exists
    const snapshot = await get(dbRef)

    if (snapshot.exists()) {
      // Update only works if the data already exists
      await update(dbRef, data)
      return Promise.resolve()
    } else {
      // If data doesn't exist, use set instead
      await set(dbRef, data)
      return Promise.resolve()
    }
  } catch (error) {
    console.error('Error updating data:', error)
    return Promise.reject(error)
  }
}

// Get data from the database
export const getData = async (path: string): Promise<any> => {
  try {
    const dbRef = ref(database, path)
    const snapshot = await get(dbRef)

    if (snapshot.exists()) {
      return Promise.resolve(snapshot.val())
    } else {
      return Promise.resolve(null)
    }
  } catch (error) {
    console.error('Error getting data:', error)
    return Promise.reject(error)
  }
}

// Get all users from the database
export const getAllUsers = async (): Promise<any[]> => {
  try {
    const dbRef = ref(database, 'quizResults')
    const snapshot = await get(dbRef)

    if (snapshot.exists()) {
      // Convert the object to an array
      const users = Object.entries(snapshot.val()).map(([key, value]) => ({
        id: key,
        ...(value as object),
      }))
      return Promise.resolve(users)
    } else {
      return Promise.resolve([])
    }
  } catch (error) {
    console.error('Error getting users:', error)
    return Promise.reject(error)
  }
}
