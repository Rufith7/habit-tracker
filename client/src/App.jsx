import { useEffect, useMemo, useState } from 'react'
import AuthForm from './components/AuthForm'
import HabitList from './components/HabitList'
import StatsCard from './components/StatsCard'
import {
  createHabit,
  deleteCheckIn,
  getCurrentUser,
  getHabitStats,
  getHabits,
  logoutUser,
} from './api'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [habits, setHabits] = useState([])
  const [habitStats, setHabitStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [dashboardLoading, setDashboardLoading] = useState(false)
  const [showHabitForm, setShowHabitForm] = useState(false)
  const [habitName, setHabitName] = useState('')
  const [habitDescription, setHabitDescription] = useState('')
  const [creatingHabit, setCreatingHabit] = useState(false)
  const [error, setError] = useState('')

  const today = useMemo(() => {
    if (!user?.timezone) {
      return new Date().toISOString().split('T')[0]
    }

    return new Intl.DateTimeFormat('en-CA', {
      timeZone: user.timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date())
  }, [user])

  useEffect(() => {
    async function checkAuthentication() {
      const token = localStorage.getItem('token')

      if (!token) {
        setLoading(false)
        return
      }

      try {
        const data = await getCurrentUser()
        setUser(data.user)
      } catch {
        logoutUser()
      } finally {
        setLoading(false)
      }
    }

    checkAuthentication()
  }, [])

  useEffect(() => {
    if (!user) return

    loadDashboard()
  }, [user])

  async function loadDashboard() {
    setDashboardLoading(true)
    setError('')

    try {
      const data = await getHabits()
      const loadedHabits = data.habits || []

      setHabits(loadedHabits)

      const statsResults = await Promise.all(
        loadedHabits.map(async (habit) => {
          try {
            const result = await getHabitStats(habit.id)

            return [habit.id, result.stats]
          } catch {
            return [
              habit.id,
              {
                currentStreak: 0,
                longestStreak: 0,
                totalCheckIns: 0,
                completedToday: false,
              },
            ]
          }
        }),
      )

      setHabitStats(Object.fromEntries(statsResults))
    } catch (error) {
      setError(error.message)
    } finally {
      setDashboardLoading(false)
    }
  }

  function handleLogin(loggedInUser) {
    setUser(loggedInUser)
  }

  function handleLogout() {
    logoutUser()
    setUser(null)
    setHabits([])
    setHabitStats({})
  }

  async function handleCreateHabit(event) {
    event.preventDefault()

    if (!habitName.trim()) return

    setCreatingHabit(true)
    setError('')

    try {
      await createHabit({
        name: habitName.trim(),
        description: habitDescription.trim(),
      })

      setHabitName('')
      setHabitDescription('')
      setShowHabitForm(false)

      await loadDashboard()
    } catch (error) {
      setError(error.message)
    } finally {
      setCreatingHabit(false)
    }
  }

  async function handleCheckIn(habitId, completed) {
    setError('')

    try {
      if (completed) {
        await deleteCheckIn(habitId, today)
      } else {
        const response = await fetch(
          `http://localhost:5001/api/habits/${habitId}/check-ins`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          },
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Unable to check in')
        }
      }

      const result = await getHabitStats(habitId)

      setHabitStats((current) => ({
        ...current,
        [habitId]: result.stats,
      }))
    } catch (error) {
      setError(error.message)
    }
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-logo">H</div>
        <div className="loading-spinner" />
        <p>Loading your habits...</p>
      </div>
    )
  }

  if (!user) {
    return <AuthForm onLogin={handleLogin} />
  }

  const totalHabits = habits.length

  const completedToday = Object.values(habitStats).filter(
    (stats) => stats.completedToday,
  ).length

  const totalCheckIns = Object.values(habitStats).reduce(
    (total, stats) => total + (stats.totalCheckIns || 0),
    0,
  )

  const currentStreak = Object.values(habitStats).reduce(
    (max, stats) => Math.max(max, stats.currentStreak || 0),
    0,
  )

  const longestStreak = Object.values(habitStats).reduce(
    (max, stats) => Math.max(max, stats.longestStreak || 0),
    0,
  )

  const completionPercentage =
    totalHabits > 0
      ? Math.round((completedToday / totalHabits) * 100)
      : 0

  return (
    <div className="app-shell">
      <div className="background-glow glow-one" />
      <div className="background-glow glow-two" />

      <header className="navbar">
        <div className="brand">
          <div className="brand-mark">H</div>

          <div>
            <strong>HabitFlow</strong>
            <span>Personal growth dashboard</span>
          </div>
        </div>

        <div className="navbar-actions">
          <div className="user-pill">
            <div className="avatar">
              {user.email.charAt(0).toUpperCase()}
            </div>

            <div className="user-info">
              <strong>{user.email}</strong>
              <span>Active account</span>
            </div>
          </div>

          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard">
        <section className="hero-section">
          <div className="hero-content">
            <div className="status-badge">
              <span className="status-dot" />
              YOUR DAILY PROGRESS
            </div>

            <h1>
              Build better habits.
              <span>Become your best self.</span>
            </h1>

            <p>
              Small actions every day create remarkable results.
              Stay consistent and let your progress compound.
            </p>
          </div>

          <div className="progress-card">
            <div className="progress-ring">
              <div className="progress-inner">
                <strong>{completionPercentage}%</strong>
                <span>today</span>
              </div>
            </div>

            <div className="progress-copy">
              <strong>Daily consistency</strong>
              <span>
                {completedToday} of {totalHabits || 0} habits completed
              </span>
            </div>
          </div>
        </section>

        {error && (
          <div className="error-banner">
            <span>!</span>
            {error}
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        <section className="stats-grid">
          <StatsCard
            icon="🔥"
            label="Current Streak"
            value={currentStreak}
            unit="days"
            accent="orange"
          />

          <StatsCard
            icon="⚡"
            label="Longest Streak"
            value={longestStreak}
            unit="days"
            accent="purple"
          />

          <StatsCard
            icon="✓"
            label="Total Check-ins"
            value={totalCheckIns}
            unit="completed"
            accent="green"
          />

          <StatsCard
            icon="◎"
            label="Active Habits"
            value={totalHabits}
            unit="habits"
            accent="blue"
          />
        </section>

        <section className="habits-section">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">TODAY · {today}</div>
              <h2>Your habits</h2>
              <p>Keep showing up. Consistency beats perfection.</p>
            </div>

            <button
              className="add-habit-button"
              onClick={() => setShowHabitForm(true)}
            >
              <span>+</span>
              Add habit
            </button>
          </div>

          {showHabitForm && (
            <div className="modal-backdrop">
              <div className="habit-modal">
                <button
                  className="modal-close"
                  onClick={() => setShowHabitForm(false)}
                >
                  ×
                </button>

                <div className="modal-icon">✦</div>

                <h2>Create a new habit</h2>
                <p>
                  Choose something small and meaningful that you
                  can consistently practice.
                </p>

                <form onSubmit={handleCreateHabit}>
                  <label htmlFor="habit-name">Habit name</label>

                  <input
                    id="habit-name"
                    value={habitName}
                    onChange={(event) =>
                      setHabitName(event.target.value)
                    }
                    placeholder="e.g. Morning workout"
                    maxLength={80}
                    autoFocus
                    required
                  />

                  <label htmlFor="habit-description">
                    Description
                  </label>

                  <input
                    id="habit-description"
                    value={habitDescription}
                    onChange={(event) =>
                      setHabitDescription(event.target.value)
                    }
                    placeholder="e.g. 30 minutes"
                    maxLength={120}
                  />

                  <div className="modal-actions">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => setShowHabitForm(false)}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="primary-button"
                      disabled={creatingHabit}
                    >
                      {creatingHabit ? 'Creating...' : 'Create habit'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {dashboardLoading ? (
            <div className="empty-state">
              <div className="loading-spinner" />
              <p>Loading your habits...</p>
            </div>
          ) : (
            <HabitList
              habits={habits}
              habitStats={habitStats}
              onCheckIn={handleCheckIn}
            />
          )}
        </section>
      </main>

      <footer className="footer">
        <span>HabitFlow</span>
        <span>Build consistency. One day at a time.</span>
      </footer>
    </div>
  )
}

export default App