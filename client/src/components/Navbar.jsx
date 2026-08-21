function Navbar() {
  return (
    <header className="navbar">
      <div className="logo">HabitFlow</div>

      <nav className="nav-links">
        <a href="#dashboard">Dashboard</a>
        <a href="#habits">Habits</a>
        <a href="#stats">Stats</a>
      </nav>

      <button className="profile-button">Profile</button>
    </header>
  )
}

export default Navbar