import HabitCard from './HabitCard'

function HabitList({ habits, habitStats, onCheckIn }) {
  if (habits.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">✦</div>

        <h3>No habits yet</h3>

        <p>
          Start with one small habit and build your consistency
          from there.
        </p>
      </div>
    )
  }

  return (
    <div className="habit-list">
      {habits.map((habit) => {
        const stats = habitStats[habit.id] || {
          completedToday: false,
          currentStreak: 0,
          longestStreak: 0,
          totalCheckIns: 0,
        }

        return (
          <HabitCard
            key={habit.id}
            name={habit.name}
            description={habit.description}
            stats={stats}
            onCheckIn={() =>
              onCheckIn(habit.id, stats.completedToday)
            }
          />
        )
      })}
    </div>
  )
}

export default HabitList