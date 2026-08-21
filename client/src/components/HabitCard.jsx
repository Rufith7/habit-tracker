import { useState } from 'react'
import { createCheckIn } from '../api'

function HabitCard({ habit, onHabitChange }) {
  const [checkingIn, setCheckingIn] = useState(false)
  const [error, setError] = useState('')

  async function handleCheckIn() {
    setCheckingIn(true)
    setError('')

    try {
      await createCheckIn(habit.id)
      await onHabitChange()
    } catch (error) {
      setError(error.message)
    } finally {
      setCheckingIn(false)
    }
  }

  return (
    <div className="habit-card">
      <div>
        <h3>{habit.name}</h3>

        {habit.description && <p>{habit.description}</p>}

        {error && <small className="error-message">{error}</small>}
      </div>

      <button
        className="check-button"
        onClick={handleCheckIn}
        disabled={checkingIn}
        title="Mark habit as completed today"
      >
        {checkingIn ? '...' : '✓'}
      </button>
    </div>
  )
}

export default HabitCard