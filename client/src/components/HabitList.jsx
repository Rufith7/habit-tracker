import { useEffect, useState } from 'react'
import { getHabits, getHabitStats } from '../api'
import HabitCard from './HabitCard'

function HabitList({ onStatsChange }) {
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadHabits() {
    try {
      setError('')

      const data = await getHabits()

      const habitsWithStats = await Promise.all(
        data.habits.map(async (habit) => {
          try {
            const statsData = await getHabitStats(habit.id)

            return {
              ...habit,
              stats: statsData.stats,
            }
          } catch {
            return {
              ...habit,
              stats: {
                currentStreak: 0,
                longestStreak: 0,
                totalCheckIns: 0,
                completedToday: false,
              },
            }
          }
        }),
      )

      setHabits(habitsWithStats)

      calculateDashboardStats(habitsWithStats)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  function calculateDashboardStats(habitsData) {
    const totalHabits = habitsData.length

    const completedToday = habitsData.filter(
      (habit) => habit.stats?.completedToday,
    ).length

    const currentStreak = habitsData.reduce(
      (highest, habit) =>
        Math.max(
          highest,
          habit.stats?.currentStreak || 0,
        ),
      0,
    )

    const longestStreak = habitsData.reduce(
      (highest, habit) =>
        Math.max(
          highest,
          habit.stats?.longestStreak || 0,
        ),
      0,
    )

    const totalCheckIns = habitsData.reduce(
      (total, habit) =>
        total + (habit.stats?.totalCheckIns || 0),
      0,
    )

    onStatsChange({
      totalHabits,
      completedToday,
      currentStreak,
      longestStreak,
      totalCheckIns,
    })
  }

  useEffect(() => {
    loadHabits()
  }, [])

  function handleCheckIn(habitId) {
    setHabits((currentHabits) => {
      const updatedHabits = currentHabits.map((habit) => {
        if (habit.id !== habitId) {
          return habit
        }

        return {
          ...habit,
          stats: {
            ...habit.stats,
            completedToday: true,
            currentStreak:
              (habit.stats?.currentStreak || 0) + 1,
            totalCheckIns:
              (habit.stats?.totalCheckIns || 0) + 1,
          },
        }
      })

      calculateDashboardStats(updatedHabits)

      return updatedHabits
    })
  }

  if (loading) {
    return <p>Loading habits...</p>
  }

  if (error) {
    return <p className="error-message">{error}</p>
  }

  if (habits.length === 0) {
    return (
      <p className="empty-message">
        No habits yet. Create your first habit!
      </p>
    )
  }

  return (
    <div className="habit-list">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          id={habit.id}
          name={habit.name}
          description={habit.description}
          completedToday={habit.stats?.completedToday || false}
          onCheckIn={handleCheckIn}
        />
      ))}
    </div>
  )
}

export default HabitList