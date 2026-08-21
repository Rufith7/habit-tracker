function HabitCard({ name, description }) {
  return (
    <div className="habit-card">
      <div>
        <h3>{name}</h3>
        <p>{description}</p>
      </div>

      <button className="check-button">✓</button>
    </div>
  )
}

export default HabitCard