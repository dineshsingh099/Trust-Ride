import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SealLogo from '../../components/common/SealLogo'
import Button from '../../components/common/Button'
import { IconShield, IconUser, IconTruck } from '../../components/common/Icons'
import './HomePage.css'

export default function HomePage() {
  const navigate = useNavigate()
  const clickCount = useRef(0)
  const clickTimer = useRef(null)
  const [spin, setSpin] = useState(false)

  const handleLogoClick = () => {
    clickCount.current += 1
    setSpin(true)
    setTimeout(() => setSpin(false), 500)

    if (clickTimer.current) clearTimeout(clickTimer.current)
    clickTimer.current = setTimeout(() => {
      clickCount.current = 0
    }, 900)

    if (clickCount.current === 3) {
      clickCount.current = 0
      navigate('/admin/login')
    }
  }

  return (
    <div className="home-page">
      <nav className="home-nav">
        <div className="home-nav-brand" onClick={handleLogoClick}>
          <SealLogo size={38} spin={spin} />
          <span>Verifyd</span>
        </div>
        <div className="home-nav-actions">
          <Button variant="ghost" size="sm" onClick={() => navigate('/choose-role?intent=login')}>
            Log in
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/choose-role?intent=signup')}>
            Get started
          </Button>
        </div>
      </nav>

      <section className="home-hero container">
        <span className="home-hero-eyebrow">Identity verification, done right</span>
        <h1 className="home-hero-title">
          One platform to verify
          <br />
          every <span className="home-hero-accent">user, driver</span> and
          <br />
          document that matters.
        </h1>
        <p className="home-hero-subtitle">
          Verifyd handles OTP-secured onboarding, driver document review, and admin
          oversight in a single, role-based system — built for teams that can't afford
          to guess who's on the other side of the screen.
        </p>
        <div className="home-hero-actions">
          <Button variant="accent" size="lg" onClick={() => navigate('/choose-role?intent=signup')}>
            Create an account
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate('/choose-role?intent=login')}>
            I already have one
          </Button>
        </div>

        <div className="home-hero-cards">
          <div className="home-mini-card">
            <IconUser />
            <div>
              <p className="home-mini-title">Users</p>
              <p className="home-mini-text">OTP verified sign-up, secure dashboard access</p>
            </div>
          </div>
          <div className="home-mini-card">
            <IconTruck />
            <div>
              <p className="home-mini-title">Drivers</p>
              <p className="home-mini-text">Guided onboarding with document review</p>
            </div>
          </div>
          <div className="home-mini-card">
            <IconShield />
            <div>
              <p className="home-mini-title">Admin</p>
              <p className="home-mini-text">Approve, reject, and track every submission</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <p>Verifyd &copy; {new Date().getFullYear()} — Built for trust at scale.</p>
      </footer>
    </div>
  )
}
