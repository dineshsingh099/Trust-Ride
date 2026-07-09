import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import Alert from '../../components/common/Alert'
import Loader from '../../components/common/Loader'
import { IconGrid, IconFile } from '../../components/common/Icons'
import { getDriverProfile, resubmitDriverDocuments } from '../../api/driverApi'

const navItems = [
  { to: '/driver/dashboard', label: 'Dashboard', icon: <IconGrid />, end: true },
  { to: '/driver/documents', label: 'Documents', icon: <IconFile /> }
]

const emptyForm = {
  driving_license_url: '',
  rc_url: '',
  insurance_url: '',
  vehicle_image_urls: '',
  identity_document_urls: '',
  other_document_urls: ''
}

export default function DriverDocuments() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const loadProfile = () => {
    setLoading(true)
    getDriverProfile()
      .then(({ data }) => setProfile(data))
      .finally(() => setLoading(false))
  }

  useEffect(loadProfile, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const toList = (value) =>
    value
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean)

  const handleResubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)
    try {
      const payload = {}
      if (form.driving_license_url) payload.driving_license_url = form.driving_license_url
      if (form.rc_url) payload.rc_url = form.rc_url
      if (form.insurance_url) payload.insurance_url = form.insurance_url
      if (form.vehicle_image_urls) payload.vehicle_image_urls = toList(form.vehicle_image_urls)
      if (form.identity_document_urls) payload.identity_document_urls = toList(form.identity_document_urls)
      if (form.other_document_urls) payload.other_document_urls = toList(form.other_document_urls)

      await resubmitDriverDocuments(payload)
      setSuccess('Documents resubmitted for Admin review.')
      setForm(emptyForm)
      loadProfile()
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to resubmit documents.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout navItems={navItems} roleLabel="Driver panel" title="Documents" userLabel={profile?.name}>
      {loading ? (
        <Loader label="Loading document status" />
      ) : (
        <>
          <Card
            title="Document status"
            subtitle="Account > Document Submission"
            actions={<Badge status={profile.document_status} />}
          >
            {profile.document_status === 'rejected' && (
              <Alert type="error">Rejection reason: {profile.rejection_reason}</Alert>
            )}
            {profile.document_status === 'pending_review' && (
              <p style={{ fontSize: 14, color: 'var(--ink-soft)' }}>
                Your documents are currently being reviewed by an Admin.
              </p>
            )}
            {profile.document_status === 'approved' && (
              <p style={{ fontSize: 14, color: 'var(--success-600)' }}>
                Your documents have been approved.
              </p>
            )}
          </Card>

          {profile.document_status === 'rejected' && (
            <Card title="Resubmit corrected documents" subtitle="Only fill in the fields you need to update.">
              <Alert type="error">{error}</Alert>
              <Alert type="success">{success}</Alert>
              <form onSubmit={handleResubmit}>
                <Input label="Driving license URL" name="driving_license_url" value={form.driving_license_url} onChange={handleChange} />
                <Input label="RC document URL" name="rc_url" value={form.rc_url} onChange={handleChange} />
                <Input label="Insurance document URL" name="insurance_url" value={form.insurance_url} onChange={handleChange} />
                <Input
                  label="Vehicle image URLs (comma separated)"
                  name="vehicle_image_urls"
                  value={form.vehicle_image_urls}
                  onChange={handleChange}
                />
                <Input
                  label="Identity document URLs (comma separated)"
                  name="identity_document_urls"
                  value={form.identity_document_urls}
                  onChange={handleChange}
                />
                <Input
                  label="Other document URLs (comma separated)"
                  name="other_document_urls"
                  value={form.other_document_urls}
                  onChange={handleChange}
                />
                <Button type="submit" loading={submitting}>
                  Resubmit for review
                </Button>
              </form>
            </Card>
          )}
        </>
      )}
    </DashboardLayout>
  )
}
