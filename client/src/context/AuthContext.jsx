import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [role, setRole] = useState(localStorage.getItem('role'))
  const [mustChangePassword, setMustChangePassword] = useState(
    localStorage.getItem('must_change_password') === 'true'
  )

  const login = useCallback((userRole, extra = {}) => {
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
    localStorage.removeItem('role')
    localStorage.removeItem('must_change_password')
    setRole(null)
    setMustChangePassword(false)
  }, [])

  const isAuthenticated = Boolean(role)

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
