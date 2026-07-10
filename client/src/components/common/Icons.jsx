const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
}

export const IconGrid = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...base} {...props}>
    <rect x="3" y="3" width="8" height="8" rx="2" />
    <rect x="13" y="3" width="8" height="8" rx="2" />
    <rect x="3" y="13" width="8" height="8" rx="2" />
    <rect x="13" y="13" width="8" height="8" rx="2" />
  </svg>
)

export const IconUser = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...base} {...props}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
)

export const IconTruck = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...base} {...props}>
    <rect x="1" y="6" width="13" height="10" rx="1.5" />
    <path d="M14 10h4l3.5 3.5V16h-7.5" />
    <circle cx="6" cy="18" r="1.8" />
    <circle cx="17" cy="18" r="1.8" />
  </svg>
)

export const IconFile = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...base} {...props}>
    <path d="M6 2h8l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z" />
    <path d="M14 2v5h5" />
    <path d="M8.5 12.5h7M8.5 16h5" />
  </svg>
)

export const IconShield = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...base} {...props}>
    <path d="M12 2 4 5v6c0 5 3.4 8.7 8 11 4.6-2.3 8-6 8-11V5l-8-3Z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
)

export const IconLogout = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...base} {...props}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5" />
    <path d="M21 12H9" />
  </svg>
)

export const IconMenu = (props) => (
  <svg viewBox="0 0 24 24" width="22" height="22" {...base} {...props}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
)

export const IconChevronLeft = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...base} {...props}>
    <path d="M15 18l-6-6 6-6" />
  </svg>
)

export const IconLock = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...base} {...props}>
    <rect x="4" y="10" width="16" height="10" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
)

export const IconClipboard = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...base} {...props}>
    <rect x="5" y="4" width="14" height="17" rx="2" />
    <rect x="9" y="2" width="6" height="4" rx="1" />
    <path d="M9 11h6M9 15h6" />
  </svg>
)
