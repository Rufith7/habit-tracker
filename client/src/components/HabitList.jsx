import HabitCard from './HabitCard'

function HabitList() {
  const habits = [
    {
      id: 1,
      name: 'Morning Exercise',
      description: '30 minutes',
    },
    {
      id: 2,
      name: 'Read a Book',
      description: '20 pages',
    },
    {
      id: 3,
      name: 'Drink Water',
      description: '8 glasses',
    },
  ]

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