import { useState } from 'react'

function HabitCard({
  name,
  description,
  stats,
  onCheckIn,
  onBackfill,
  loading,
  error,
}) {
  const [showBackfill, setShowBackfill] = useState(false)
  const [backfillDate, setBackfillDate] = useState('')

  const completed = stats?.completedToday

  function handleBackfill(event) {
    event.preventDefault()

    if (!backfillDate) {
      return
    }

    onBackfill(backfillDate)

    setBackfillDate('')
    setShowBackfill(false)
  }

  function toggleBackfill() {
    setShowBackfill((current) => !current)

    if (showBackfill) {
      setBackfillDate('')
    }
  }

  return (
    <article
      className={`habit-card ${completed ? 'completed' : ''}`}
    >
      <div className="habit-card-left">
        <button
          type="button"
          className={`check-button ${
            completed ? 'checked' : ''
          }`}
          onClick={onCheckIn}
          disabled={loading || completed}
          aria-label={
            completed
              ? `${name} completed today`
              : `Complete ${name} today`
          }
        >
          {completed ? '✓' : ''}
        </button>

        <div className="habit-info">
          <div className="habit-title-row">
            <h3>{name}</h3>

            {completed && (
              <span className="completed-badge">
                ✓ Completed
              </span>
            )}
          </div>

          {description && (
            <p className="habit-description">
              {description}
            </p>
          )}

          <div className="habit-meta">
            <div className="habit-stat streak-stat">
              <span className="habit-stat-icon">
                🔥
              </span>

              <div>
                <strong>
                  {stats?.currentStreak || 0}
                </strong>

                <span>day streak</span>
              </div>
            </div>

            <div className="habit-stat checkin-stat">
              <span className="habit-stat-icon">
                ✓
              </span>

              <div>
                <strong>
                  {stats?.totalCheckIns || 0}
                </strong>

                <span>check-ins</span>
              </div>
            </div>

            <div className="habit-stat best-stat">
              <span className="habit-stat-icon">
                🏆
              </span>

              <div>
                <strong>
                  {stats?.longestStreak || 0}
                </strong>

                <span>best streak</span>
              </div>
            </div>
          </div>

          {error && (
            <div
              className="habit-error"
              role="alert"
            >
              <span>!</span>

              <p>{error}</p>
            </div>
          )}

          <div className="backfill-area">
            {!showBackfill ? (
              <button
                type="button"
                className="backfill-toggle"
                onClick={toggleBackfill}
                disabled={loading}
              >
                <span className="backfill-icon">
                  ↶
                </span>

                <span className="backfill-text">
                  <strong>
                    Backfill a missed day
                  </strong>

                  <small>
                    Add a check-in for a previous day
                  </small>
                </span>

                <span className="backfill-arrow">
                  →
                </span>
              </button>
            ) : (
              <div className="backfill-panel">
                <div className="backfill-header">
                  <div>
                    <strong>
                      Backfill a missed day
                    </strong>

                    <span>
                      Select a previous date
                    </span>
                  </div>

                  <button
                    type="button"
                    className="backfill-close"
                    onClick={toggleBackfill}
                    disabled={loading}
                    aria-label="Cancel backfill"
                  >
                    ×
                  </button>
                </div>

                <form
                  className="backfill-form"
                  onSubmit={handleBackfill}
                >
                  <div className="date-input-wrapper">
                    <span className="calendar-icon">
                      📅
                    </span>

                    <input
                      type="date"
                      value={backfillDate}
                      onChange={(event) =>
                        setBackfillDate(
                          event.target.value,
                        )
                      }
                      required
                      disabled={loading}
                      aria-label={`Backfill date for ${name}`}
                    />
                  </div>

                  <button
                    type="submit"
                    className="backfill-submit"
                    disabled={
                      loading || !backfillDate
                    }
                  >
                    {loading ? (
                      <>
                        <span className="button-spinner" />
                        Saving...
                      </>
                    ) : (
                      <>
                        ✓ Check in
                      </>
                    )}
                  </button>
                </form>

                <p className="backfill-hint">
                  You can select today or a previous
                  date. Future dates are not allowed.
                </p>
              </div>
            )}
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