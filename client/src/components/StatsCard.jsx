function StatsCard({
  icon,
  label,
  value,
  unit,
  accent = 'purple',
}) {
  return (
    <article className={`stat-card stat-${accent}`}>
      <div className="stat-top">
        <div className="stat-icon">{icon}</div>

        <span className="stat-label">{label}</span>
      </div>

      <div className="stat-value-row">
        <strong>{value}</strong>
        <span>{unit}</span>
      </div>
    </article>
  )
}

export default StatsCard