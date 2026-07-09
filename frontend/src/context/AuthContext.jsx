import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [role, setRole] = useState(localStorage.getItem('role'))
  const [mustChangePassword, setMustChangePassword] = useState(
    localStorage.getItem('must_change_password') === 'true'
  )

  const login = useCallback((tokens, userRole, extra = {}) => {
    localStorage.setItem('access_token', tokens.access_token)
    localStorage.setItem('refresh_token', tokens.refresh_token)
    localStorage.setItem('role', userRole)
    if (extra.must_change_password) {
      localStorage.setItem('must_change_password', 'true')
      setMustChangePassword(true)
    } else {
      localStorage.removeItem('must_change_password')
      setMustChangePassword(false)
    }
    setRole(userRole)
  }, [])

  const clearMustChangePassword = useCallback(() => {
    localStorage.removeItem('must_change_password')
    setMustChangePassword(false)
  }, [])

  const logout = useCallback(() => {
    localStorage.clear()
    setRole(null)
    setMustChangePassword(false)
  }, [])

  const isAuthenticated = Boolean(localStorage.getItem('access_token'))

  return (
    <AuthContext.Provider
      value={{ role, isAuthenticated, mustChangePassword, login, logout, clearMustChangePassword }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
