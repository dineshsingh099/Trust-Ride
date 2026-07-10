import { NavLink } from 'react-router-dom'
import SealLogo from '../common/SealLogo'
import { IconChevronLeft, IconLogout } from '../common/Icons'
import { useAuth } from '../../context/AuthContext'
import { logoutUser } from '../../api/userApi'
import { logoutDriver } from '../../api/driverApi'
import { logoutAdmin } from '../../api/adminApi'
import './Sidebar.css'

export default function Sidebar({ navItems, collapsed, onToggle, mobileOpen, roleLabel }) {
  const { role, logout } = useAuth()

  const handleLogout = async () => {
    try {
      if (role === 'driver') {
        await logoutDriver()
      } else if (role === 'admin') {
        await logoutAdmin()
      } else {
        await logoutUser()
      }
    } catch {
    }
    logout()
  }

  return (
    <>
      <div className={`sidebar-backdrop ${mobileOpen ? 'sidebar-backdrop-visible' : ''}`} onClick={onToggle} />
      <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''} ${mobileOpen ? 'sidebar-mobile-open' : ''}`}>
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <SealLogo size={34} />
            {!collapsed && (
              <div className="sidebar-brand-text">
                <span className="sidebar-brand-name">Verifyd</span>
                <span className="sidebar-brand-role">{roleLabel}</span>
              </div>
            )}
          </div>
          <button className="sidebar-toggle" onClick={onToggle} aria-label="Toggle sidebar">
            <IconChevronLeft className={collapsed ? 'sidebar-toggle-rotated' : ''} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <button className="sidebar-logout" onClick={handleLogout}>
          <IconLogout />
          {!collapsed && <span>Log out</span>}
        </button>
      </aside>
    </>
  )
}
