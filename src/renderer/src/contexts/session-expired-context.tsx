import React, { createContext, useState, useContext, ReactNode } from 'react'

interface SessionExpiredContextData {
  isSessionExpired: boolean
  showSessionExpiredModal: () => void
  hideSessionExpiredModal: () => void
}

export const SessionExpiredContext = createContext<SessionExpiredContextData>(
  {} as SessionExpiredContextData
)

export const SessionExpiredProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSessionExpired, setIsSessionExpired] = useState(false)

  const showSessionExpiredModal = (): void => {
    setIsSessionExpired(true)
  }

  const hideSessionExpiredModal = (): void => {
    setIsSessionExpired(false)
  }

  return (
    <SessionExpiredContext.Provider
      value={{ isSessionExpired, showSessionExpiredModal, hideSessionExpiredModal }}
    >
      {children}
    </SessionExpiredContext.Provider>
  )
}

export function useSessionExpired(): SessionExpiredContextData {
  const context = useContext(SessionExpiredContext)
  return context
}
