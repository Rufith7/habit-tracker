import { useState } from 'react'
import { createCheckIn } from '../api'

function HabitCard({ id, name, description, completedToday, onCheckIn }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCheckIn() {
    if (completedToday || loading) {
      return
    }

    setError('')
    setLoading(true)

    try {
      await createCheckIn(id)
      onCheckIn(id)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="habit-card">
      <div className="habit-info">
        <h3>{name}</h3>
        <p>{description || 'No description'}</p>

        {error && <small className="habit-error">{error}</small>}
      </div>

      <button
        type="button"
        className={`check-button ${completedToday ? 'completed' : ''}`}
        onClick={handleCheckIn}
        disabled={completedToday || loading}
        title={
          completedToday
            ? 'Completed today'
            : 'Mark habit as complete'
        }
      >
        {loading ? '...' : completedToday ? '✓' : '✓'}
      </button>
    </div>
  )
}

export default HabitCard