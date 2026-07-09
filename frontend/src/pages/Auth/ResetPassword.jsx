import { useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import AuthLayout from './AuthLayout'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import Alert from '../../components/common/Alert'
import { resetUserPassword } from '../../api/userApi'
import { resetDriverPassword } from '../../api/driverApi'

export default function ResetPassword() {
  const { role } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [token, setToken] = useState(params.get('token') || '')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isDriver = role === 'driver'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isDriver) {
        await resetDriverPassword(token, newPassword)
      } else {
        await resetUserPassword(token, newPassword)
      }
      navigate(`/${role}/login`)
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to reset password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout eyebrow="Reset password" title="Choose a new password" subtitle="This link expires in 30 minutes.">
      <Alert type="error">{error}</Alert>
      <form onSubmit={handleSubmit}>
        <Input label="Reset token" value={token} onChange={(e) => setToken(e.target.value)} required />
        <Input
          label="New password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          minLength={8}
          required
        />
        <Button type="submit" fullWidth loading={loading}>
          Update password
        </Button>
      </form>
    </AuthLayout>
  )
}
