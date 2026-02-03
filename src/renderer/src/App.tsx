import React from 'react'
import { AuthProvider, useAuth } from './contexts/auth-context'
import { CenterProvider } from './contexts/center-context'
import { LoaderComponent } from './components/Loader'
import { Routes } from './Routes'
import { SchoolYearProvider } from './contexts/school-year-context'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/react-query'

const AppContent: React.FC = () => {
  const { loading } = useAuth()

  if (loading) {
    return <LoaderComponent />
  }

  return <Routes />
}

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CenterProvider>
          <SchoolYearProvider>
            <AppContent />
          </SchoolYearProvider>
        </CenterProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
