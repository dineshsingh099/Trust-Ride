import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import AuthLayout from './AuthLayout'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import Alert from '../../components/common/Alert'
import { loginUser } from '../../api/userApi'
import { loginDriver } from '../../api/driverApi'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const { role } = useParams()
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isDriver = role === 'driver'
  const roleLabel = isDriver ? 'Driver' : 'User'

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isDriver) {
        const { data } = await loginDriver(form.email, form.password)
        login('driver')
        navigate(data.profile_completed ? '/driver/dashboard' : '/driver/onboarding')
      } else {
        await loginUser(form.email, form.password)
        login('user')
        navigate('/user/dashboard')
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to log in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      eyebrow={`${roleLabel} login`}
      title="Welcome back"
      subtitle={`Log in to your ${roleLabel.toLowerCase()} account to continue.`}
      footer={
        <>
          New here? <Link to={`/${role}/signup`}>Create an account</Link>
          <br />
          <Link to={`/${role}/forgot-password`}>Forgot password?</Link>
        </>
      }
    >
      <Alert type="error">{error}</Alert>
      <form onSubmit={handleSubmit}>
        <Input
          label="Email address"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          required
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
        />
        <Button type="submit" fullWidth loading={loading}>
          Log in
        </Button>
      </form>
    </AuthLayout>
  )
}
