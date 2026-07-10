import './SealLogo.css'

export default function SealLogo({ size = 44, onClick, spin = false }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={`seal-logo ${spin ? 'seal-logo-spin' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      <circle cx="32" cy="32" r="30" fill="var(--brand-700)" />
      <circle cx="32" cy="32" r="30" fill="none" stroke="var(--accent-500)" strokeWidth="2" strokeDasharray="4 6" />
      <path
        d="M20 33 L28 41 L44 23"
        fill="none"
        stroke="#fff"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
