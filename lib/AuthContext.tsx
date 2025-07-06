'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, AuthSession } from './types'
import { generateUserKey, storeUserKey, retrieveUserKey, removeUserKey } from './encryption'

interface AuthContextType {
  user: User | null
  session: AuthSession | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string) => Promise<{ success: boolean; message: string }>
  logout: () => Promise<void>
  verifyMagicLink: (token: string) => Promise<{ success: boolean; message: string }>
  checkSession: () => Promise<void>
  updateUserData: (userData: Partial<User>) => void
  userKey: string | null
  hasEncryptionKey: boolean
  setupEncryption: (userId: string) => void
  clearEncryption: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<AuthSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userKey, setUserKey] = useState<string | null>(null)

  const isAuthenticated = !!user && !!session
  const hasEncryptionKey = !!userKey

  // Verificar sesión al inicializar
  useEffect(() => {
    checkSession()
  }, [])

  // Configurar cifrado cuando hay usuario
  useEffect(() => {
    if (user?._id) {
      setupEncryption(user._id.toString())
    }
  }, [user])

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setSession(data.session)
      } else {
        setUser(null)
        setSession(null)
        clearEncryption()
      }
    } catch (error) {
      console.error('Error checking session:', error)
      setUser(null)
      setSession(null)
      clearEncryption()
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        return {
          success: true,
          message: 'Enlace mágico enviado a tu email. Revisa tu bandeja de entrada.'
        }
      } else {
        return {
          success: false,
          message: data.error || 'Error al enviar enlace mágico'
        }
      }
    } catch (error) {
      console.error('Error in login:', error)
      return {
        success: false,
        message: 'Error de conexión. Intenta de nuevo.'
      }
    }
  }

  const verifyMagicLink = async (token: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch('/api/auth/verify-magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        setSession(data.session)
        return {
          success: true,
          message: 'Sesión iniciada correctamente'
        }
      } else {
        return {
          success: false,
          message: data.error || 'Enlace inválido o expirado'
        }
      }
    } catch (error) {
      console.error('Error verifying magic link:', error)
      return {
        success: false,
        message: 'Error de conexión. Intenta de nuevo.'
      }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Error in logout:', error)
    } finally {
      setUser(null)
      setSession(null)
      clearEncryption()
    }
  }

  const updateUserData = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData })
    }
  }

  const setupEncryption = (userId: string) => {
    const existingKey = retrieveUserKey(userId)
    if (existingKey) {
      setUserKey(existingKey)
    } else {
      const newKey = generateUserKey(userId)
      storeUserKey(userId, newKey)
      setUserKey(newKey)
    }
  }

  const clearEncryption = () => {
    if (user?._id) {
      removeUserKey(user._id.toString())
    }
    setUserKey(null)
  }

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated,
    login,
    logout,
    verifyMagicLink,
    checkSession,
    updateUserData,
    userKey,
    hasEncryptionKey,
    setupEncryption,
    clearEncryption
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
} 