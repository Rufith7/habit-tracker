import { useEffect, useState } from 'react'
import AuthForm from './components/AuthForm'
import HabitList from './components/HabitList'
import StatsCard from './components/StatsCard'
import { getCurrentUser, logoutUser } from './api'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

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
  }

  if (loading) {
    return <div className="loading-screen">Loading...</div>
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

        <button onClick={handleLogout}>Logout</button>
      </header>

      <main className="dashboard">
        <section className="dashboard-header">
          <div>
            <h1>My Habits</h1>
            <p>Build consistency, one day at a time.</p>
          </div>
        </section>

        <section className="stats-grid">
          <StatsCard
            label="Total Habits"
            value="3"
            unit="habits"
          />

          <StatsCard
            label="Completed Today"
            value="0"
            unit="check-ins"
          />

          <StatsCard
            label="Current Streak"
            value="0"
            unit="days"
          />
        </section>

        <section>
          <h2>Your Habits</h2>
          <HabitList />
        </section>
      </main>
    </div>
  )
}

export default App