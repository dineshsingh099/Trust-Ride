import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, allowedRole }) {
  const { role, isAuthenticated, mustChangePassword } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }
  if (role !== allowedRole) {
    return <Navigate to="/" replace />
  }
  if (allowedRole === 'admin' && mustChangePassword) {
    return <Navigate to="/admin/change-password" replace />
  }
  return children
}
