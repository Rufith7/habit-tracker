function HabitCard({
  name,
  description,
  stats,
  onCheckIn,
}) {
  const completed = stats?.completedToday

  return (
    <article className={`habit-card ${completed ? 'completed' : ''}`}>
      <div className="habit-card-left">
        <button
          className={`check-button ${completed ? 'checked' : ''}`}
          onClick={onCheckIn}
          aria-label={
            completed
              ? `Undo ${name} check-in`
              : `Complete ${name}`
          }
        >
          {completed ? '✓' : ''}
        </button>

        <div className="habit-info">
          <div className="habit-title-row">
            <h3>{name}</h3>

            {completed && (
              <span className="completed-badge">
                Completed
              </span>
            )}
          </div>

          {description && <p>{description}</p>}

          <div className="habit-meta">
            <span>
              🔥 {stats?.currentStreak || 0} day streak
            </span>

            <span>
              ✓ {stats?.totalCheckIns || 0} check-ins
            </span>
          </div>
        </div>
      </div>

      <div className="habit-arrow">
        →
      </div>
    </article>
  )
}

export default HabitCard