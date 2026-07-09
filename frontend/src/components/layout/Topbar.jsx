import { IconMenu } from '../common/Icons'
import './Topbar.css'

export default function Topbar({ title, onMenuClick, userLabel }) {
  const initial = userLabel ? userLabel.charAt(0).toUpperCase() : '?'
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="topbar-menu-btn" onClick={onMenuClick} aria-label="Open menu">
          <IconMenu />
        </button>
        <h1 className="topbar-title">{title}</h1>
      </div>
      <div className="topbar-right">
        <div className="topbar-avatar">{initial}</div>
        <span className="topbar-user-label">{userLabel}</span>
      </div>
    </header>
  )
}
