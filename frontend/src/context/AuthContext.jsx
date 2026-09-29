import { createContext, useContext, useMemo, useState } from 'react'
import { authApi } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('access_token'))
  const [role, setRole] = useState(() => localStorage.getItem('user_role'))

  const login = async (credentials) => {
    const { data } = await authApi.login(credentials)
    localStorage.setItem('access_token', data.access_token)
    localStorage.setItem('user_role', credentials.role)
    setToken(data.access_token)
    setRole(credentials.role)
    return data
  }

  const register = async (credentials) => {
    const { data } = await authApi.register(credentials)
    localStorage.setItem('access_token', data.access_token)
    localStorage.setItem('user_role', 'user')
    setToken(data.access_token)
    setRole('user')
    return data
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_role')
    setToken(null)
    setRole(null)
  }

  const value = useMemo(
    () => ({ token, role, isAuthenticated: Boolean(token), login, register, logout }),
    [token, role],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
