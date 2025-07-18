import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { blink } from '../blink/client'
import { User, AuthState } from '../types'

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [tokens, setTokens] = useState<any>(null)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setIsLoading(state.isLoading)
      setIsAuthenticated(state.isAuthenticated)
      setTokens(state.tokens)
    })

    return unsubscribe
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // For now, we'll simulate login with Blink auth
      // In a real implementation, you'd call your backend API
      await blink.auth.login()
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const logout = () => {
    blink.auth.logout()
  }

  const updateUser = async (userData: Partial<User>) => {
    try {
      await blink.auth.updateMe(userData)
      if (user) {
        setUser({ ...user, ...userData })
      }
    } catch (error) {
      console.error('Update user failed:', error)
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    tokens,
    login,
    logout,
    updateUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}