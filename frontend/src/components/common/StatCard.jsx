import './StatCard.css'

export default function StatCard({ label, value, icon, tone = 'brand' }) {
  return (
    <div className={`stat-card stat-tone-${tone}`}>
      <div className="stat-icon">{icon}</div>
      <div>
        <p className="stat-value">{value}</p>
        <p className="stat-label">{label}</p>
      </div>
    </div>
  )
}
