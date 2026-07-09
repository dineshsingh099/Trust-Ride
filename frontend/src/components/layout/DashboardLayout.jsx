import { useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import './DashboardLayout.css'

export default function DashboardLayout({ navItems, roleLabel, title, userLabel, children }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleToggle = () => {
    if (window.innerWidth <= 900) {
      setMobileOpen((prev) => !prev)
    } else {
      setCollapsed((prev) => !prev)
    }
  }

  return (
    <div className="dashboard-shell">
      <Sidebar
        navItems={navItems}
        collapsed={collapsed}
        onToggle={handleToggle}
        mobileOpen={mobileOpen}
        roleLabel={roleLabel}
      />
      <div className={`dashboard-main ${collapsed ? 'dashboard-main-collapsed' : ''}`}>
        <Topbar title={title} onMenuClick={handleToggle} userLabel={userLabel} />
        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  )
}
