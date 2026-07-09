import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Loader from '../../components/common/Loader'
import { IconGrid, IconUser } from '../../components/common/Icons'
import { getUserProfile } from '../../api/userApi'

const navItems = [
  { to: '/user/dashboard', label: 'Dashboard', icon: <IconGrid />, end: true },
  { to: '/user/profile', label: 'Profile', icon: <IconUser /> }
]

export default function UserProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUserProfile()
      .then(({ data }) => setProfile(data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardLayout navItems={navItems} roleLabel="User panel" title="Profile" userLabel={profile?.name}>
      {loading ? (
        <Loader label="Loading profile" />
      ) : (
        <Card title="Personal information" subtitle="This is how your account appears to Verifyd.">
          <div className="profile-grid">
            <div>
              <p className="profile-label">Full name</p>
              <p className="profile-value">{profile.name}</p>
            </div>
            <div>
              <p className="profile-label">Email</p>
              <p className="profile-value">{profile.email}</p>
            </div>
            <div>
              <p className="profile-label">Phone number</p>
              <p className="profile-value">{profile.phone_number}</p>
            </div>
            <div>
              <p className="profile-label">Role</p>
              <p className="profile-value" style={{ textTransform: 'capitalize' }}>{profile.role}</p>
            </div>
          </div>
        </Card>
      )}
      <style>{`
        .profile-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }
        .profile-label {
          font-size: 12px;
          color: var(--muted);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 4px;
        }
        .profile-value {
          font-size: 15px;
          font-weight: 600;
        }
      `}</style>
    </DashboardLayout>
  )
}
