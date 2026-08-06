import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { userService } from '../api/userService'
import { AUTH_KEYS } from '../config/auth'
import type { AuthContextType, LoginDTO, RegisterUserDTO, User } from '../types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await userService.me()
        if (response?.data) {
          setUser(response.data)
          localStorage.setItem(AUTH_KEYS.USER, JSON.stringify(response.data))
        }
      } catch {
        setUser(null)
        localStorage.removeItem(AUTH_KEYS.USER)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const register = async (data: RegisterUserDTO) => {
    const response = await userService.register(data)
    return response
  }

  const login = async (data: LoginDTO) => {
    const response = await userService.login(data.email, data.password)

    if (response?.data?.user) {
      setUser(response.data.user)
      localStorage.setItem(AUTH_KEYS.USER, JSON.stringify(response.data.user))
    }
  }

  const logout = useCallback(async () => {
    await userService.logout()
    setUser(null)
    localStorage.removeItem(AUTH_KEYS.USER)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token: null,
        isAuthenticated: !!user,
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}
