import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { User } from 'firebase/auth'
import { logout as logoutFromModel } from '../pages/Auth/AuthModel'
import { subscribeToAuthChanges } from '../services/authService'
import type { AuthContextValue, AuthProviderProps } from '../types'

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((nextUser) => {
      setUser(nextUser)
      setAuthLoading(false)
    })

    return unsubscribe
  }, [])

  const logout = useCallback(async () => {
    await logoutFromModel()
  }, [])

  const value = useMemo(
    () => ({
      user,
      authLoading,
      logout,
    }),
    [user, authLoading, logout],
  )

  if (authLoading) {
    return <div className="auth-loading">Loading...</div>
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
