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
        await registerUser({
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
      <div className="auth-background-orb orb-one" />
      <div className="auth-background-orb orb-two" />

      <div className="auth-layout">
        <section className="auth-showcase">
          <div className="brand auth-brand">
            <div className="brand-mark">H</div>

            <div>
              <strong>HabitFlow</strong>
              <span>Personal growth dashboard</span>
            </div>
          </div>

          <div className="showcase-content">
            <div className="status-badge">
              <span className="status-dot" />
              BUILD YOUR BEST SELF
            </div>

            <h1>
              Small habits.
              <span>Big changes.</span>
            </h1>

            <p>
              Turn everyday actions into lasting progress.
              Track your habits, build streaks, and become
              more consistent one day at a time.
            </p>

            <div className="showcase-stats">
              <div>
                <strong>01</strong>
                <span>Track</span>
              </div>

              <div>
                <strong>02</strong>
                <span>Commit</span>
              </div>

              <div>
                <strong>03</strong>
                <span>Grow</span>
              </div>
            </div>
          </div>
        </section>

        <section className="auth-panel">
          <div className="auth-card">
            <div className="auth-card-header">
              <div className="auth-icon">✦</div>

              <h2>
                {isLogin
                  ? 'Welcome back'
                  : 'Start your journey'}
              </h2>

              <p>
                {isLogin
                  ? 'Sign in to continue your progress.'
                  : 'Create an account and start building better habits.'}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="email">Email address</label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Minimum 8 characters"
                  minLength={8}
                  autoComplete={
                    isLogin ? 'current-password' : 'new-password'
                  }
                  required
                />
              </div>

              {!isLogin && (
                <div className="input-group">
                  <label htmlFor="timezone">Timezone</label>

                  <input
                    id="timezone"
                    type="text"
                    value={timezone}
                    onChange={(event) =>
                      setTimezone(event.target.value)
                    }
                    required
                  />
                </div>
              )}

              {error && (
                <div className="auth-error">
                  <span>!</span>
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="auth-submit"
                disabled={loading}
              >
                {loading
                  ? 'Please wait...'
                  : isLogin
                    ? 'Sign in'
                    : 'Create account'}

                {!loading && <span>→</span>}
              </button>
            </form>

            <div className="auth-divider">
              <span>OR</span>
            </div>

            <button
              type="button"
              className="auth-toggle"
              onClick={toggleMode}
            >
              {isLogin
                ? "Don't have an account?"
                : 'Already have an account?'}

              <strong>
                {isLogin ? 'Create one' : 'Sign in'}
              </strong>
            </button>
          </div>

          <p className="auth-footer">
            Your progress belongs to you.
          </p>
        </section>
      </div>
    </div>
  )
}

export default AuthForm