import HabitCard from './HabitCard'

function HabitList({ habits, onHabitChange }) {
  if (habits.length === 0) {
    return <p>No habits yet. Create your first habit!</p>
  }

  return (
    <div className="habit-list">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onHabitChange={onHabitChange}
        />
      ))}
    </div>
  )
}

export default HabitList