import { useEffect, useState } from 'react'
import AuthForm from './components/AuthForm'
import HabitList from './components/HabitList'
import StatsCard from './components/StatsCard'
import {
  getCurrentUser,
  getHabits,
  logoutUser,
  createHabit,
} from './api'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)
  const [habitsLoading, setHabitsLoading] = useState(false)
  const [error, setError] = useState('')

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [habitName, setHabitName] = useState('')
  const [habitDescription, setHabitDescription] = useState('')
  const [creating, setCreating] = useState(false)

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
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuthentication()
  }, [])

  useEffect(() => {
    if (!user) {
      return
    }

    loadHabits()
  }, [user])

  async function loadHabits() {
    setHabitsLoading(true)
    setError('')

    try {
      const data = await getHabits()
      setHabits(data.habits || [])
    } catch (error) {
      setError(error.message)
    } finally {
      setHabitsLoading(false)
    }
  }

  function handleLogin(loggedInUser) {
    setUser(loggedInUser)
  }

  function handleLogout() {
    logoutUser()
    setUser(null)
    setHabits([])
  }

  async function handleCreateHabit(event) {
    event.preventDefault()

    if (!habitName.trim()) {
      return
    }

    setCreating(true)
    setError('')

    try {
      await createHabit({
        name: habitName.trim(),
        description: habitDescription.trim(),
      })

      setHabitName('')
      setHabitDescription('')
      setShowCreateForm(false)

      await loadHabits()
    } catch (error) {
      setError(error.message)
    } finally {
      setCreating(false)
    }
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

          <button
            className="primary-button"
            onClick={() => setShowCreateForm((current) => !current)}
          >
            {showCreateForm ? 'Cancel' : '+ Add Habit'}
          </button>
        </section>

        {showCreateForm && (
          <form className="create-habit-form" onSubmit={handleCreateHabit}>
            <h2>Create a Habit</h2>

            <label htmlFor="habit-name">Habit name</label>

            <input
              id="habit-name"
              type="text"
              value={habitName}
              onChange={(event) => setHabitName(event.target.value)}
              placeholder="Morning Exercise"
              required
            />

            <label htmlFor="habit-description">Description</label>

            <input
              id="habit-description"
              type="text"
              value={habitDescription}
              onChange={(event) => setHabitDescription(event.target.value)}
              placeholder="30 minutes"
            />

            <button type="submit" disabled={creating}>
              {creating ? 'Creating...' : 'Create Habit'}
            </button>
          </form>
        )}

        {error && <p className="error-message">{error}</p>}

        <section className="stats-grid">
          <StatsCard
            label="Total Habits"
            value={habits.length}
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

          {habitsLoading ? (
            <p>Loading habits...</p>
          ) : (
            <HabitList habits={habits} onHabitChange={loadHabits} />
          )}
        </section>
      </main>
    </div>
  )
}

export default App