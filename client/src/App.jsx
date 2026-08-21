import { useEffect, useState } from 'react'
import AuthForm from './components/AuthForm'
import HabitList from './components/HabitList'
import StatsCard from './components/StatsCard'
import { getCurrentUser, logoutUser } from './api'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const [stats, setStats] = useState({
    totalHabits: 0,
    completedToday: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalCheckIns: 0,
  })

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

  function handleLogin(loggedInUser) {
    setUser(loggedInUser)
  }

  function handleLogout() {
    logoutUser()
    setUser(null)

    setStats({
      totalHabits: 0,
      completedToday: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalCheckIns: 0,
    })
  }

  function handleStatsChange(newStats) {
    setStats(newStats)
  }

  if (loading) {
    return (
      <div className="loading-screen">
        Loading...
      </div>
    )
  }

  if (!user) {
    return <AuthForm onLogin={handleLogin} />
  }

  return (
    <div className="app">
      <header className="navbar">
        <div>
          <h2>Habit Tracker</h2>
          <span>{user.email}</span>
        </div>

        <button
          type="button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      <main className="dashboard">
        <section className="dashboard-header">
          <div>
            <h1>My Habits</h1>
            <p>
              Build consistency, one day at a time.
            </p>
          </div>
        </section>

        <section className="stats-grid">
          <StatsCard
            label="Total Habits"
            value={stats.totalHabits}
            unit="habits"
          />

          <StatsCard
            label="Completed Today"
            value={stats.completedToday}
            unit="check-ins"
          />

          <StatsCard
            label="Current Streak"
            value={stats.currentStreak}
            unit="days"
          />

          <StatsCard
            label="Longest Streak"
            value={stats.longestStreak}
            unit="days"
          />

          <StatsCard
            label="Total Check-ins"
            value={stats.totalCheckIns}
            unit="completed"
          />
        </section>

        <section className="habits-section">
          <div className="section-header">
            <div>
              <p className="eyebrow">TODAY</p>
              <h2>Your Habits</h2>
            </div>
          </div>

          <HabitList
            onStatsChange={handleStatsChange}
          />
        </section>
      </main>
    </div>
  )
}

export default App