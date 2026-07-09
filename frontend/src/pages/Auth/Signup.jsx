import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import AuthLayout from './AuthLayout'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import Alert from '../../components/common/Alert'
import { registerUser } from '../../api/userApi'
import { registerDriver } from '../../api/driverApi'

export default function Signup() {
  const { role } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone_number: '', password: '' })
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
        await registerDriver(form)
      } else {
        await registerUser(form)
      }
      navigate(`/${role}/verify-otp`, { state: { email: form.email } })
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to register. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      eyebrow={`${roleLabel} sign up`}
      title="Create your account"
      subtitle="We'll email you a one-time code to verify it's really you."
      footer={
        <>
          Already have an account? <Link to={`/${role}/login`}>Log in</Link>
        </>
      }
    >
      <Alert type="error">{error}</Alert>
      <form onSubmit={handleSubmit}>
        <Input label="Full name" name="name" value={form.name} onChange={handleChange} placeholder="Jordan Lee" required />
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
          label="Phone number"
          name="phone_number"
          value={form.phone_number}
          onChange={handleChange}
          placeholder="+1 555 000 0000"
          required
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="At least 8 characters"
          minLength={8}
          required
        />
        <Button type="submit" fullWidth loading={loading}>
          Send verification code
        </Button>
      </form>
    </AuthLayout>
  )
}
