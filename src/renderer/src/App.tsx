import React, { useEffect } from 'react'
import { AuthProvider, useAuth } from './contexts/auth-context'
import { CenterProvider } from './contexts/center-context'
import { LoaderComponent } from './components/Loader'
import { Routes } from './Routes'
import { SchoolYearProvider } from './contexts/school-year-context'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/react-query'
import { SessionExpiredProvider, useSessionExpired } from './contexts/session-expired-context'
import { SessionExpiredModal } from './components/SessionExpiredModal'
import { setupApiInterceptor } from './services/api'

const SessionExpiredHandler: React.FC = () => {
  const { isSessionExpired, showSessionExpiredModal, hideSessionExpiredModal } = useSessionExpired()
  const { logout } = useAuth()

  useEffect(() => {
    setupApiInterceptor(showSessionExpiredModal)
  }, [showSessionExpiredModal])

  const handleConfirm = async (): Promise<void> => {
    hideSessionExpiredModal()
    await logout()
    window.location.href = '/login'
  }

  return <SessionExpiredModal isOpen={isSessionExpired} onConfirm={handleConfirm} />
}

const AppContent: React.FC = () => {
  const { loading } = useAuth()

  if (loading) {
    return <LoaderComponent />
  }

  return (
    <>
      <SessionExpiredHandler />
      <Routes />
    </>
  )
}

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SessionExpiredProvider>
          <CenterProvider>
            <SchoolYearProvider>
              <AppContent />
            </SchoolYearProvider>
          </CenterProvider>
        </SessionExpiredProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
