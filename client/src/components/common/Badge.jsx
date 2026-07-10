import './Badge.css'

const STATUS_MAP = {
  approved: { label: 'Approved', tone: 'success' },
  pending_review: { label: 'Pending review', tone: 'warning' },
  rejected: { label: 'Rejected', tone: 'danger' },
  not_submitted: { label: 'Not submitted', tone: 'muted' }
}

export default function Badge({ status, children }) {
  if (children) {
    return <span className="badge badge-muted">{children}</span>
  }
  const config = STATUS_MAP[status] || STATUS_MAP.not_submitted
  return <span className={`badge badge-${config.tone}`}>{config.label}</span>
}
