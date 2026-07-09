import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SealLogo from '../../components/common/SealLogo'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import Alert from '../../components/common/Alert'
import { getDriverProfile, submitDriverProfileForm } from '../../api/driverApi'
import './DriverOnboarding.css'

const emptyForm = {
  vehicle_type: '',
  make: '',
  model: '',
  year: '',
  plate_number: '',
  color: '',
  driving_license_url: '',
  rc_url: '',
  insurance_url: '',
  vehicle_image_urls: '',
  identity_document_urls: '',
  other_document_urls: ''
}

export default function DriverOnboarding() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getDriverProfile().then(({ data }) => {
      if (data.profile_completed) {
        navigate('/driver/dashboard')
      }
      setProfile(data)
    })
  }, [navigate])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const toList = (value) =>
    value
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await submitDriverProfileForm({
        vehicle_info: {
          vehicle_type: form.vehicle_type,
          make: form.make,
          model: form.model,
          year: form.year,
          plate_number: form.plate_number,
          color: form.color
        },
        driving_license_url: form.driving_license_url,
        rc_url: form.rc_url,
        insurance_url: form.insurance_url,
        vehicle_image_urls: toList(form.vehicle_image_urls),
        identity_document_urls: toList(form.identity_document_urls),
        other_document_urls: toList(form.other_document_urls)
      })
      navigate('/driver/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to submit your details.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="onboarding-shell">
      <div className="onboarding-card">
        <div className="onboarding-header">
          <SealLogo size={36} />
          <div>
            <h2>Complete your driver profile</h2>
            <p>This appears only once. Fill in your vehicle and documents to get verified.</p>
          </div>
        </div>

        <Alert type="error">{error}</Alert>

        {profile && (
          <div className="onboarding-prefill">
            <div><span>Name</span><strong>{profile.name}</strong></div>
            <div><span>Email</span><strong>{profile.email}</strong></div>
            <div><span>Phone</span><strong>{profile.phone_number}</strong></div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <h4 className="onboarding-section-title">Vehicle information</h4>
          <div className="onboarding-grid">
            <Input label="Vehicle type" name="vehicle_type" value={form.vehicle_type} onChange={handleChange} required />
            <Input label="Make" name="make" value={form.make} onChange={handleChange} required />
            <Input label="Model" name="model" value={form.model} onChange={handleChange} required />
            <Input label="Year" name="year" value={form.year} onChange={handleChange} required />
            <Input label="Plate number" name="plate_number" value={form.plate_number} onChange={handleChange} required />
            <Input label="Color" name="color" value={form.color} onChange={handleChange} required />
          </div>

          <h4 className="onboarding-section-title">Documents</h4>
          <Input label="Driving license URL" name="driving_license_url" value={form.driving_license_url} onChange={handleChange} required />
          <Input label="RC document URL" name="rc_url" value={form.rc_url} onChange={handleChange} required />
          <Input label="Insurance document URL" name="insurance_url" value={form.insurance_url} onChange={handleChange} required />
          <Input
            label="Vehicle image URLs (comma separated)"
            name="vehicle_image_urls"
            value={form.vehicle_image_urls}
            onChange={handleChange}
            required
          />
          <Input
            label="Identity document URLs (comma separated)"
            name="identity_document_urls"
            value={form.identity_document_urls}
            onChange={handleChange}
            required
          />
          <Input
            label="Other document URLs (optional, comma separated)"
            name="other_document_urls"
            value={form.other_document_urls}
            onChange={handleChange}
          />

          <Button type="submit" fullWidth loading={loading}>
            Submit for review
          </Button>
        </form>
      </div>
    </div>
  )
}
