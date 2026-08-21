function StatsCard({ label, value, unit }) {
  return (
    <div className="stat-card">
      <span className="stat-label">
        {label}
      </span>

      <strong>{value}</strong>

      <span className="stat-unit">
        {unit}
      </span>
    </div>
  )
}

export default StatsCard