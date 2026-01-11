import React from 'react'
import { AuthProvider, useAuth } from './contexts/auth-context'
import { CenterProvider } from './contexts/center-context'
import { LoaderComponent } from './components/Loader'
import { Routes } from './Routes'
import { SchoolYearProvider } from './contexts/school-year-context'

const AppContent: React.FC = () => {
  const { loading } = useAuth()

  if (loading) {
    return <LoaderComponent />
  }

  return <Routes />
}

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <CenterProvider>
        <SchoolYearProvider>
          <AppContent />
        </SchoolYearProvider>
      </CenterProvider>
    </AuthProvider>
  )
}
