import { useState } from 'react'
import { loginUser, registerUser } from '../api'

function AuthForm({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  )
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      let data

      if (isLogin) {
        data = await loginUser({
          email,
          password,
        })
      } else {
        data = await registerUser({
          email,
          password,
          timezone,
        })

        data = await loginUser({
          email,
          password,
        })
      }

      onLogin(data.user)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  function toggleMode() {
    setIsLogin((current) => !current)
    setError('')
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>

        <p>
          {isLogin
            ? 'Sign in to continue tracking your habits.'
            : 'Start building better habits today.'}
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />

          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Minimum 8 characters"
            minLength="8"
            required
          />

          {!isLogin && (
            <>
              <label htmlFor="timezone">Timezone</label>

              <input
                id="timezone"
                type="text"
                value={timezone}
                onChange={(event) => setTimezone(event.target.value)}
                required
              />
            </>
          )}

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading
              ? 'Please wait...'
              : isLogin
                ? 'Sign In'
                : 'Create Account'}
          </button>
        </form>

        <button
          type="button"
          className="auth-toggle"
          onClick={toggleMode}
        >
          {isLogin
            ? "Don't have an account? Register"
            : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  )
}

export default AuthForm