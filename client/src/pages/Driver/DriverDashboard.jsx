import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import StatCard from '../../components/common/StatCard'
import Badge from '../../components/common/Badge'
import Loader from '../../components/common/Loader'
import { IconGrid, IconFile, IconTruck } from '../../components/common/Icons'
import { getDriverProfile } from '../../api/driverApi'

const navItems = [
  { to: '/driver/dashboard', label: 'Dashboard', icon: <IconGrid />, end: true },
  { to: '/driver/documents', label: 'Documents', icon: <IconFile /> }
]

export default function DriverDashboard() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDriverProfile()
      .then(({ data }) => setProfile(data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardLayout navItems={navItems} roleLabel="Driver panel" title="Dashboard" userLabel={profile?.name}>
      {loading ? (
        <Loader label="Loading your dashboard" />
      ) : (
        <>
          <div className="grid-stats">
            <StatCard label="Document status" value={<Badge status={profile.document_status} />} icon={<IconFile />} tone="brand" />
            <StatCard label="Profile" value="Complete" icon={<IconTruck />} tone="success" />
          </div>
          <Card title={`Welcome, ${profile.name.split(' ')[0]}`} subtitle="Track your document review progress here.">
            {profile.document_status === 'rejected' ? (
              <p style={{ color: 'var(--danger-600)', fontSize: 14 }}>
                Your documents were rejected: {profile.rejection_reason}. Head to
                Documents to resubmit corrected files.
              </p>
            ) : profile.document_status === 'approved' ? (
              <p style={{ color: 'var(--success-600)', fontSize: 14 }}>
                You're fully verified. You can now accept trips on the platform.
              </p>
            ) : (
              <p style={{ color: 'var(--ink-soft)', fontSize: 14 }}>
                Your documents are with our Admin team for review. We'll notify you by
                email once a decision has been made.
              </p>
            )}
          </Card>
        </>
      )}
      <style>{`
        .grid-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          margin-bottom: 20px;
        }
      `}</style>
    </DashboardLayout>
  )
}
