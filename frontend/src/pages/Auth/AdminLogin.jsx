import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from './AuthLayout'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import Alert from '../../components/common/Alert'
import { IconLock } from '../../components/common/Icons'
import { loginAdmin } from '../../api/adminApi'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await loginAdmin(form.email, form.password)
      login(data.tokens, 'admin', { must_change_password: data.must_change_password })
      navigate(data.must_change_password ? '/admin/change-password' : '/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid admin credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Restricted access"
      title={
        <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
          <IconLock /> Admin login
        </span>
      }
      subtitle="Authorized administrators only."
    >
      <Alert type="error">{error}</Alert>
      <form onSubmit={handleSubmit}>
        <Input
          label="Admin email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <Button type="submit" fullWidth loading={loading}>
          Log in as admin
        </Button>
      </form>
    </AuthLayout>
  )
}
