import Navbar from './components/Navbar'
import StatsCard from './components/StatsCard'
import HabitList from './components/HabitList'
import './App.css'

function App() {
  return (
    <div className="app">
      <Navbar />

      <main className="main-content">
        <section className="welcome-section">
          <p className="eyebrow">YOUR HABIT JOURNEY</p>

          <h1>
            Build better habits.
            <br />
            One day at a time.
          </h1>

          <p className="subtitle">
            Track your daily habits, maintain your streaks, and stay consistent.
          </p>
        </section>

        <section className="stats-grid" id="stats">
          <StatsCard
            label="Current Streak"
            value="4"
            unit="days"
          />

          <StatsCard
            label="Longest Streak"
            value="7"
            unit="days"
          />

          <StatsCard
            label="Total Check-ins"
            value="24"
            unit="completed"
          />
        </section>

        <section className="habits-section" id="habits">
          <div className="section-header">
            <div>
              <p className="eyebrow">TODAY</p>
              <h2>Your Habits</h2>
            </div>

            <button className="primary-button">
              + Add Habit
            </button>
          </div>

          <HabitList />
        </section>
      </main>
    </div>
  )
}

export default App