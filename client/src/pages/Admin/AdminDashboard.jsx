import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import StatCard from '../../components/common/StatCard'
import Loader from '../../components/common/Loader'
import { IconGrid, IconTruck, IconShield } from '../../components/common/Icons'
import { getPendingDrivers } from '../../api/adminApi'

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: <IconGrid />, end: true },
  { to: '/admin/drivers', label: 'Driver review', icon: <IconTruck /> }
]

export default function AdminDashboard() {
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPendingDrivers()
      .then(({ data }) => setPending(data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardLayout navItems={navItems} roleLabel="Admin panel" title="Dashboard" userLabel="Admin">
      {loading ? (
        <Loader label="Loading overview" />
      ) : (
        <>
          <div className="grid-stats">
            <StatCard label="Pending driver reviews" value={pending.length} icon={<IconTruck />} tone="accent" />
            <StatCard label="System status" value="Operational" icon={<IconShield />} tone="success" />
          </div>
          <Card title="Overview" subtitle="Manage platform verification from a single place.">
            <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
              {pending.length > 0
                ? `${pending.length} driver${pending.length > 1 ? 's are' : ' is'} waiting on document review. Head to Driver review to approve or reject submissions.`
                : 'No drivers are currently awaiting review.'}
            </p>
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
