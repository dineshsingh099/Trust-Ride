import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import StatCard from '../../components/common/StatCard'
import Loader from '../../components/common/Loader'
import { IconGrid, IconUser } from '../../components/common/Icons'
import { getUserProfile } from '../../api/userApi'

const navItems = [
  { to: '/user/dashboard', label: 'Dashboard', icon: <IconGrid />, end: true },
  { to: '/user/profile', label: 'Profile', icon: <IconUser /> }
]

export default function UserDashboard() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUserProfile()
      .then(({ data }) => setProfile(data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardLayout navItems={navItems} roleLabel="User panel" title="Dashboard" userLabel={profile?.name}>
      {loading ? (
        <Loader label="Loading your dashboard" />
      ) : (
        <>
          <div className="grid-stats">
            <StatCard label="Account status" value="Verified" icon={<IconUser />} tone="success" />
            <StatCard label="Member since" value={new Date(profile.created_at).toLocaleDateString()} icon={<IconGrid />} tone="brand" />
          </div>
          <Card title={`Welcome back, ${profile.name.split(' ')[0]}`} subtitle="Here's a quick look at your account.">
            <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>
              Your account is verified and active. Use the sidebar to manage your profile
              at any time.
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
