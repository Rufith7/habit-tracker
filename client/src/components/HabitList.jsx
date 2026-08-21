import { useEffect, useState } from 'react'
import { getHabits } from '../api'
import HabitCard from './HabitCard'

function HabitList() {
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadHabits() {
      try {
        const data = await getHabits()
        setHabits(data.habits)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadHabits()
  }, [])

  if (loading) {
    return <p>Loading habits...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  if (habits.length === 0) {
    return <p>No habits yet. Create your first habit!</p>
  }

  return (
    <div className="habit-list">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          name={habit.name}
          description={habit.description}
        />
      ))}
    </div>
  )
}

export default HabitList