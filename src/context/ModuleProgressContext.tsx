'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type ModuleProgressContextType = {
  completedModules: string[]
  currentModule: string
  completeModule: (moduleId: string) => void
  canAccessModule: (moduleId: string) => boolean
}

const ModuleProgressContext = createContext<
  ModuleProgressContextType | undefined
>(undefined)

export function ModuleProgressProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [completedModules, setCompletedModules] = useState<string[]>([])
  const [currentModule, setCurrentModule] = useState<string>('module-1')

  // Load progress from localStorage on client-side
  useEffect(() => {
    const savedCompletedModules = localStorage.getItem('completedModules')
    const savedCurrentModule = localStorage.getItem('currentModule')

    if (savedCompletedModules) {
      setCompletedModules(JSON.parse(savedCompletedModules))
    }

    if (savedCurrentModule) {
      setCurrentModule(savedCurrentModule)
    }
  }, [])

  // Save progress to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('completedModules', JSON.stringify(completedModules))
    localStorage.setItem('currentModule', currentModule)
  }, [completedModules, currentModule])

  const completeModule = (moduleId: string) => {
    if (!completedModules.includes(moduleId)) {
      const newCompletedModules = [...completedModules, moduleId]
      setCompletedModules(newCompletedModules)

      // Determine next module
      const moduleNumber = parseInt(moduleId.split('-')[1])
      const nextModuleId = `module-${moduleNumber + 1}`
      setCurrentModule(nextModuleId)
    }
  }

  const canAccessModule = (moduleId: string) => {
    // Always allow access to completed modules
    if (completedModules.includes(moduleId)) {
      return true
    }

    // Allow access to current module
    if (moduleId === currentModule) {
      return true
    }

    // For other modules, check if previous module is completed
    const moduleNumber = parseInt(moduleId.split('-')[1])
    const previousModuleId = `module-${moduleNumber - 1}`

    // First module is always accessible
    if (moduleNumber === 1) {
      return true
    }

    return completedModules.includes(previousModuleId)
  }

  return (
    <ModuleProgressContext.Provider
      value={{
        completedModules,
        currentModule,
        completeModule,
        canAccessModule,
      }}
    >
      {children}
    </ModuleProgressContext.Provider>
  )
}

export function useModuleProgress() {
  const context = useContext(ModuleProgressContext)
  if (context === undefined) {
    throw new Error(
      'useModuleProgress must be used within a ModuleProgressProvider'
    )
  }
  return context
}
