import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [role, setRole] = useState(localStorage.getItem('role'))

  const login = useCallback((userRole) => {
    localStorage.setItem('role', userRole)
    setRole(userRole)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('role')
    setRole(null)
  }, [])

  const isAuthenticated = Boolean(role)

  return (
    <AuthContext.Provider value={{ role, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
