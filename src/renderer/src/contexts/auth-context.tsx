import { IAuth, loginService, logoutService, signupService } from '@renderer/services/user'
import { getFromStorage, removeFromStorage, saveToStorage } from '@renderer/utils/storage'
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react'

interface AuthContextData {
  signed: boolean
  loading: boolean
  user: IAuth | null
  login: (data: IAuth) => Promise<IAuth | null>
  signup: (data: IAuth) => Promise<number | undefined>
  logout: () => Promise<void>
}

// Criação do contexto
export const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IAuth | null>(null)
  const [loading, setLoading] = useState(true)

  // Persistência do usuário no local storage
  useEffect(() => {
    function loadStorageData(): void {
      const storagedUser = getFromStorage('user')

      if (storagedUser) {
        setUser(storagedUser as IAuth)
      }
      setLoading(false)
    }
    loadStorageData()
  }, [])

  // Função para login
  const login = async ({ password, username }: IAuth): Promise<IAuth | null> => {
    try {
      const response = await loginService({ password, username })
      if (response) {
        setUser(response.data)
        saveToStorage('user', response.data)

        return response.data
      }
      return null
    } finally {
      setLoading(false)
    }
  }

  // Função para signup
  const signup = async (data: IAuth): Promise<number | undefined> => {
    try {
      const status = await signupService(data)
      return status
    } catch (error) {
      console.log('erro de cadastro no contexto ', error)
      throw error
    }
  }

  // Função para logout
  const logout = async (): Promise<void> => {
    removeFromStorage('center')
    removeFromStorage('user')

    await logoutService()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
export function useAuth(): AuthContextData {
  const context = useContext(AuthContext)
  return context
}
