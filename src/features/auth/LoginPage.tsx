// ============================================================
// LoginPage — Premium Auth Card (Sign In / Sign Up)
// ============================================================

import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'
import './LoginPage.css'

type Mode = 'signin' | 'signup'

export default function LoginPage() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setDisplayName('')
    setError(null)
  }

  const switchMode = (next: Mode) => {
    resetForm()
    setMode(next)
  }

  const getErrorMessage = (code: string): string => {
    const map: Record<string, string> = {
      'auth/user-not-found':       'No account found with this email.',
      'auth/wrong-password':        'Incorrect password. Please try again.',
      'auth/invalid-credential':    'Invalid email or password.',
      'auth/email-already-in-use':  'An account with this email already exists.',
      'auth/weak-password':         'Password must be at least 6 characters.',
      'auth/invalid-email':         'Please enter a valid email address.',
      'auth/too-many-requests':     'Too many attempts. Please try again later.',
    }
    return map[code] ?? 'Something went wrong. Please try again.'
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (mode === 'signin') {
        await signIn(email, password)
      } else {
        await signUp(email, password, displayName)
      }
      navigate('/dashboard')
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? ''
      setError(getErrorMessage(code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-bg">
      {/* Animated gradient orbs */}
      <div className="login-orb login-orb--1" />
      <div className="login-orb login-orb--2" />
      <div className="login-orb login-orb--3" />

      <div className="login-wrapper">
        {/* Brand */}
        <div className="login-brand">
          <div className="login-brand__icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="url(#brandGrad)" />
              <path d="M7 10h14M7 14h10M7 18h6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              <defs>
                <linearGradient id="brandGrad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="login-brand__name">DSBD</span>
        </div>

        {/* Card */}
        <div className="login-card">
          {/* Tab switcher */}
          <div className="login-tabs">
            <button
              id="tab-signin"
              className={`login-tab ${mode === 'signin' ? 'login-tab--active' : ''}`}
              onClick={() => switchMode('signin')}
              type="button"
            >
              Sign In
            </button>
            <button
              id="tab-signup"
              className={`login-tab ${mode === 'signup' ? 'login-tab--active' : ''}`}
              onClick={() => switchMode('signup')}
              type="button"
            >
              Create Account
            </button>
            <div className={`login-tab-indicator ${mode === 'signup' ? 'login-tab-indicator--right' : ''}`} />
          </div>

          {/* Heading */}
          <div className="login-header">
            <h1 className="login-title">
              {mode === 'signin' ? 'Welcome back' : 'Get started'}
            </h1>
            <p className="login-subtitle">
              {mode === 'signin'
                ? 'Sign in to your DSBD account'
                : 'Create your free account today'}
            </p>
          </div>

          {/* Form */}
          <form id="login-form" className="login-form" onSubmit={handleSubmit} noValidate>
            {/* Name field — signup only */}
            <div className={`login-field-wrap ${mode === 'signup' ? 'login-field-wrap--visible' : ''}`}>
              <div className="login-field">
                <label className="login-label" htmlFor="displayName">Full Name</label>
                <div className="login-input-wrap">
                  <span className="login-input-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                  <input
                    id="displayName"
                    className="login-input"
                    type="text"
                    placeholder="Jane Doe"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    required={mode === 'signup'}
                    autoComplete="name"
                    tabIndex={mode === 'signup' ? 0 : -1}
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="login-field">
              <label className="login-label" htmlFor="email">Email Address</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M1 6l7 4 7-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
                <input
                  id="email"
                  className="login-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="login-field">
              <div className="login-label-row">
                <label className="login-label" htmlFor="password">Password</label>
                {mode === 'signin' && (
                  <a href="#" className="login-forgot" tabIndex={-1}>Forgot password?</a>
                )}
              </div>
              <div className="login-input-wrap">
                <span className="login-input-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
                <input
                  id="password"
                  className="login-input login-input--password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={mode === 'signup' ? 'Min. 6 characters' : '••••••••'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  id="toggle-password"
                  className="login-eye"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M2 2l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="login-error" role="alert">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M7 4v3M7 9.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              id="submit-login"
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? (
                <span className="login-spinner" />
              ) : (
                <>
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Footer switch */}
          <p className="login-switch">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              id="switch-mode"
              className="login-switch__btn"
              onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        <p className="login-legal">
          By continuing, you agree to our{' '}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </p>
      </div>
    </div>
  )
}
