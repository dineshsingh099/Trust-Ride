import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Alert from '../../components/common/Alert'
import Loader from '../../components/common/Loader'
import { IconGrid, IconTruck, IconLock } from '../../components/common/Icons'
import { getPendingDrivers, reviewDriver } from '../../api/adminApi'

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: <IconGrid />, end: true },
  { to: '/admin/drivers', label: 'Driver review', icon: <IconTruck /> },
  { to: '/admin/change-password', label: 'Change password', icon: <IconLock /> }
]

export default function AdminDriverReview() {
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [reasonMap, setReasonMap] = useState({})
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  const loadDrivers = () => {
    setLoading(true)
    getPendingDrivers()
      .then(({ data }) => setDrivers(data))
      .finally(() => setLoading(false))
  }

  useEffect(loadDrivers, [])

  const handleReasonChange = (id, value) => setReasonMap({ ...reasonMap, [id]: value })

  const handleDecision = async (id, decision) => {
    setError('')
    setBusyId(id)
    try {
      await reviewDriver(id, decision, decision === 'reject' ? reasonMap[id] : undefined)
      loadDrivers()
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to submit decision.')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <DashboardLayout navItems={navItems} roleLabel="Admin panel" title="Driver review" userLabel="Admin">
      <Alert type="error">{error}</Alert>
      {loading ? (
        <Loader label="Loading pending drivers" />
      ) : drivers.length === 0 ? (
        <Card title="Nothing to review" subtitle="All caught up.">
          <p style={{ fontSize: 14, color: 'var(--muted)' }}>No drivers are awaiting document review right now.</p>
        </Card>
      ) : (
        <div className="review-grid">
          {drivers.map((driver) => (
            <Card key={driver.id} title={driver.name} subtitle={driver.email}>
              <div className="review-details">
                <p><strong>Vehicle:</strong> {driver.vehicle_info?.make} {driver.vehicle_info?.model} ({driver.vehicle_info?.plate_number})</p>
                <p><strong>License:</strong> <a href={driver.documents?.driving_license_url} target="_blank" rel="noreferrer">View document</a></p>
                <p><strong>RC:</strong> <a href={driver.documents?.rc_url} target="_blank" rel="noreferrer">View document</a></p>
                <p><strong>Insurance:</strong> <a href={driver.documents?.insurance_url} target="_blank" rel="noreferrer">View document</a></p>
              </div>
              <Input
                label="Rejection reason (required to reject)"
                value={reasonMap[driver.id] || ''}
                onChange={(e) => handleReasonChange(driver.id, e.target.value)}
                placeholder="Explain what needs correcting"
              />
              <div className="review-actions">
                <Button variant="primary" loading={busyId === driver.id} onClick={() => handleDecision(driver.id, 'approve')}>
                  Approve
                </Button>
                <Button variant="danger" loading={busyId === driver.id} onClick={() => handleDecision(driver.id, 'reject')}>
                  Reject
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      <style>{`
        .review-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 18px;
        }
        .review-details {
          font-size: 13.5px;
          color: var(--ink-soft);
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 18px;
        }
        .review-details a {
          color: var(--brand-700);
          font-weight: 600;
        }
        .review-actions {
          display: flex;
          gap: 10px;
        }
      `}</style>
    </DashboardLayout>
  )
}
