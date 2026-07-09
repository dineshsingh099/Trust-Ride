import { Link } from 'react-router-dom'
import SealLogo from '../../components/common/SealLogo'
import './AuthLayout.css'

export default function AuthLayout({ eyebrow, title, subtitle, children, footer }) {
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <Link to="/" className="auth-brand">
          <SealLogo size={38} />
          <span>Verifyd</span>
        </Link>
        {eyebrow && <span className="auth-eyebrow">{eyebrow}</span>}
        <h2 className="auth-title">{title}</h2>
        {subtitle && <p className="auth-subtitle">{subtitle}</p>}
        <div className="auth-body">{children}</div>
        {footer && <div className="auth-footer">{footer}</div>}
      </div>
    </div>
  )
}
