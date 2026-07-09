import { useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import AuthLayout from './AuthLayout'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import Alert from '../../components/common/Alert'
import { verifyUserOtp, resendUserOtp } from '../../api/userApi'
import { verifyDriverOtp, resendDriverOtp } from '../../api/driverApi'
import { useAuth } from '../../context/AuthContext'

export default function VerifyOtp() {
  const { role } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState(location.state?.email || '')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)

  const isDriver = role === 'driver'

  const handleVerify = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isDriver) {
        const { data } = await verifyDriverOtp(email, otp)
        login(data.tokens, 'driver')
        navigate('/driver/onboarding')
      } else {
        const { data } = await verifyUserOtp(email, otp)
        login(data.tokens, 'user')
        navigate('/user/dashboard')
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid or expired code.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setError('')
    setInfo('')
    setResending(true)
    try {
      if (isDriver) {
        await resendDriverOtp(email)
      } else {
        await resendUserOtp(email)
      }
      setInfo('A new code has been sent to your email.')
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to resend code.')
    } finally {
      setResending(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Verify your email"
      title="Enter the code we sent you"
      subtitle={`We emailed a verification code to ${email || 'your inbox'}.`}
    >
      <Alert type="error">{error}</Alert>
      <Alert type="success">{info}</Alert>
      <form onSubmit={handleVerify}>
        <Input
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="6-digit code"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="123456"
          maxLength={8}
          required
        />
        <Button type="submit" fullWidth loading={loading}>
          Verify and continue
        </Button>
      </form>
      <Button variant="ghost" fullWidth loading={resending} onClick={handleResend}>
        Resend code
      </Button>
    </AuthLayout>
  )
}
