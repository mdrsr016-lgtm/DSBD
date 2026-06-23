// ============================================================
// LoginPage — Premium Auth Card (Sign In / Sign Up)
// ============================================================

import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'
import './LoginPage.css'

type Mode = 'signin' | 'signup'

// ── Agent data keyed by area ─────────────────────────────────
interface Agent {
  id: string
  name: string
  title: string
  phone: string
  email: string
  areas: string[]          // location names this agent covers
  availability: string
  badge: string            // initials for avatar
  badgeColor: string
}

const ALL_AGENTS: Agent[] = [
  {
    id: 'a1',
    name: 'Md. Rafiqul Islam',
    title: 'Senior Area Agent',
    phone: '+880 1711-234567',
    email: 'rafiqul.islam@dsbd.gov.bd',
    areas: ['Dhaka', 'Mirpur', 'Pallabi', 'Kafrul', 'Uttara'],
    availability: 'Sun – Thu, 9 AM – 5 PM',
    badge: 'RI',
    badgeColor: '#7c3aed',
  },
  {
    id: 'a2',
    name: 'Fatema Begum',
    title: 'Area Agent',
    phone: '+880 1812-345678',
    email: 'fatema.begum@dsbd.gov.bd',
    areas: ['Chittagong', 'Agrabad', 'Halishahar', 'Patenga', 'Pahartali'],
    availability: 'Sun – Thu, 9 AM – 5 PM',
    badge: 'FB',
    badgeColor: '#0e7490',
  },
  {
    id: 'a3',
    name: 'Kamal Hossain',
    title: 'Area Agent',
    phone: '+880 1912-456789',
    email: 'kamal.hossain@dsbd.gov.bd',
    areas: ['Sylhet', 'Beanibazar', 'Golapganj', 'Zakiganj'],
    availability: 'Sun – Thu, 9 AM – 5 PM',
    badge: 'KH',
    badgeColor: '#b45309',
  },
  {
    id: 'a4',
    name: 'Nasrin Akter',
    title: 'Area Agent',
    phone: '+880 1611-567890',
    email: 'nasrin.akter@dsbd.gov.bd',
    areas: ['Rajshahi', 'Boalia', 'Motihar', 'Shah Makhdum', 'Paba'],
    availability: 'Sun – Thu, 9 AM – 5 PM',
    badge: 'NA',
    badgeColor: '#be185d',
  },
  {
    id: 'a5',
    name: 'Jahangir Alam',
    title: 'Area Agent',
    phone: '+880 1511-678901',
    email: 'jahangir.alam@dsbd.gov.bd',
    areas: ['Khulna', 'Sonadanga', 'Khalishpur', 'Daulatpur', 'Rupsha'],
    availability: 'Sun – Thu, 9 AM – 5 PM',
    badge: 'JA',
    badgeColor: '#065f46',
  },
  {
    id: 'a6',
    name: 'Roksana Parvin',
    title: 'Area Agent',
    phone: '+880 1411-789012',
    email: 'roksana.parvin@dsbd.gov.bd',
    areas: ['Barisal', 'Kotwali', 'Bandor', 'Kazirhat', 'Chanmari'],
    availability: 'Sun – Thu, 9 AM – 5 PM',
    badge: 'RP',
    badgeColor: '#92400e',
  },
]

type GpsState = 'idle' | 'requesting' | 'granted' | 'denied' | 'unavailable'

// ── Match agents by detected city / locality ─────────────────
function matchAgents(city: string): Agent[] {
  const q = city.toLowerCase()
  return ALL_AGENTS.filter(a =>
    a.areas.some(area => area.toLowerCase().includes(q) || q.includes(area.toLowerCase()))
  )
}

// ── Reverse-geocode coords → city name via open API ──────────
async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
    { headers: { 'Accept-Language': 'en' } }
  )
  const data = await res.json()
  return (
    data.address?.city ||
    data.address?.town ||
    data.address?.county ||
    data.address?.state ||
    'Your Location'
  )
}

// ============================================================
export default function LoginPage() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  // Auth state
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  // Forgot-password modal
  const [showForgotModal, setShowForgotModal] = useState(false)

  // Sign-up modal
  const [showSignupModal, setShowSignupModal] = useState(false)

  // Settings dock state
  const [settingsExpanded, setSettingsExpanded] = useState(false)
  const [isBengali, setIsBengali] = useState(false)

  // Language selection modal
  const [showLangModal, setShowLangModal] = useState(false)

  // Legal modals
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)

  // Chatbot modal and conversation log
  const [showChatbotModal, setShowChatbotModal] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string }>>([])
  const [chatInput, setChatInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  // Find-agent modal
  const [showAgentModal, setShowAgentModal] = useState(false)
  const [gpsState, setGpsState] = useState<GpsState>('idle')
  const [detectedCity, setDetectedCity] = useState<string>('')
  const [nearbyAgents, setNearbyAgents] = useState<Agent[]>([])
  const [geoError, setGeoError] = useState<string>('')

  // ── Reset agent modal when opened ───────────────────────────
  useEffect(() => {
    if (showAgentModal) {
      setGpsState('idle')
      setDetectedCity('')
      setNearbyAgents([])
      setGeoError('')
    }
  }, [showAgentModal])

  // ── Initialize Chatbot Messages on open ──────────────────────
  useEffect(() => {
    if (showChatbotModal) {
      setChatMessages([
        {
          sender: 'bot',
          text: isBengali
            ? 'হ্যালো! আমি আপনার ডিএসবিডি এআই সহকারী। আপনার দৈনিক বাজেট, সক্রিয় ঋণ, বা অ্যাকাউন্ট কীভাবে তৈরি করবেন সে সম্পর্কে জিজ্ঞাসা করুন।'
            : 'Hello! I am your DSBD AI Assistant. Ask me anything about your daily budgets, active loans, or how to register an account.'
        }
      ])
      setIsTyping(false)
      setChatInput('')
    }
  }, [showChatbotModal, isBengali])

  // ── Auto-scroll chatbot messages to bottom ──────────────────
  useEffect(() => {
    const el = document.getElementById('chatbot-messages')
    if (el) el.scrollTop = el.scrollHeight
  }, [chatMessages, isTyping])

  // ── GPS detection ───────────────────────────────────────────
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setGpsState('unavailable')
      setGeoError('Geolocation is not supported by your browser. Please enable location access and try again.')
      setNearbyAgents([])
      return
    }
    setGpsState('requesting')
    setGeoError('')
    setNearbyAgents([])
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setGpsState('granted')
        const city = await reverseGeocode(pos.coords.latitude, pos.coords.longitude)
        setDetectedCity(city)
        setNearbyAgents(matchAgents(city))
      },
      (err) => {
        setGpsState('denied')
        setNearbyAgents([])
        if (err.code === err.PERMISSION_DENIED) {
          setGeoError('Location access was denied. Please allow location permission and try again.')
        } else {
          setGeoError('Could not determine your location. Please try again.')
        }
      },
      { timeout: 10000 }
    )
  }

  // ── Auth helpers ────────────────────────────────────────────
  const resetForm = () => {
    setEmail(''); setPassword(''); setDisplayName(''); setError(null)
  }
  const switchMode = (next: Mode) => { resetForm(); setMode(next) }

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
      if (mode === 'signin') { await signIn(email, password) }
      else                   { await signUp(email, password, displayName) }
      navigate('/dashboard')
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? ''
      setError(getErrorMessage(code))
    } finally {
      setLoading(false)
    }
  }

  // ── Chatbot send handler ─────────────────────────────────────
  const handleChatSend = () => {
    const text = chatInput.trim()
    if (!text) return
    const userMsg = { sender: 'user' as const, text }
    setChatMessages(prev => [...prev, userMsg])
    setChatInput('')
    setIsTyping(true)
    setTimeout(() => {
      const q = text.toLowerCase()
      let reply = isBengali
        ? 'আমি দুঃখিত, আমি সেটি বুঝতে পারিনি। অনুগ্রহ করে বাজেট, ঋণ বা নিবন্ধন সম্পর্কে জিজ্ঞাসা করুন।'
        : "I'm not sure about that. Try asking about budgets, loans, or account registration."
      if (q.includes('budget') || q.includes('বাজেট')) {
        reply = isBengali
          ? 'আপনার বাজেট ট্র্যাক করতে ড্যাশবোর্ডে লগইন করুন এবং "বাজেট" বিভাগে যান।'
          : 'To track your budget, log in and navigate to the Budget section in your dashboard.'
      } else if (q.includes('loan') || q.includes('ঋণ')) {
        reply = isBengali
          ? 'আপনার সক্রিয় ঋণ দেখতে ড্যাশবোর্ডের "ঋণ" বিভাগে যান।'
          : 'To manage your loans, go to the Loans section after signing in.'
      } else if (q.includes('register') || q.includes('sign up') || q.includes('নিবন্ধন')) {
        reply = isBengali
          ? 'নিবন্ধন করতে আপনার এলাকা এজেন্টের সাথে যোগাযোগ করুন।'
          : 'To register, please contact your Area Agent — they will create your account.'
      } else if (q.includes('password') || q.includes('পাসওয়ার্ড')) {
        reply = isBengali
          ? 'পাসওয়ার্ড রিসেট করতে আপনার এলাকা এজেন্টের সাথে যোগাযোগ করুন।'
          : 'To reset your password, contact your Area Agent for a secure identity verification.'
      } else if (q.includes('hello') || q.includes('hi') || q.includes('হ্যালো') || q.includes('হাই')) {
        reply = isBengali ? 'হ্যালো! আপনাকে কীভাবে সাহায্য করতে পারি?' : 'Hello! How can I help you today?'
      }
      setIsTyping(false)
      setChatMessages(prev => [...prev, { sender: 'bot', text: reply }])
    }, 1200)
  }

  // ============================================================
  return (
    <div className="login-bg">
      {/* Animated gradient orbs */}
      <div className="login-orb login-orb--1" />
      <div className="login-orb login-orb--2" />
      <div className="login-orb login-orb--3" />

      <div className="login-wrapper">
        {/* Card */}
        <div className="login-card">
          {/* Brand Logo */}
          <div className="login-brand">
            <div className="login-brand__icon">
              <svg viewBox="0 0 5000 4008" width="34" height="34" fill="none">
                <path
                  fill="url(#brandGrad)"
                  d="M3886 750.5h327.8c115.6 0 220.8 47.4 297.1 123.6l.3.3c76.2 76.3 123.6 181.5 123.6 297.1v723.8h224.9c40.7 0 73.8 33.1 73.8 73.8v1014.4c0 40.7-33.1 73.7-73.8 73.7h-224.9v467.1c0 115.7-47.4 220.9-123.6 297.2l-.3.2c-76.3 76.3-181.5 123.7-297.1 123.7H487c-115.7 0-220.9-47.4-297.1-123.7l-.3-.2C113.4 3745.2 66 3640 66 3524.3V477c0-113.8 45.9-217.5 120-293.5 72.4-74.1 171.9-121.9 282.1-126.8 3.4-.4 6.9-.7 10.4-.7H3465c115.6 0 220.9 47.4 297.1 123.6l.3.3C3838.6 256.2 3886 361.4 3886 477zM487 898l-8.8-.1-2.4-.1c-93.6-2.4-179.9-36-248.9-90.5l-.9-.8-2.1-1.6-1.8-1.5-6.1-5-2.1-1.8-.4-.3v2728c0 75.3 30.8 143.7 80.3 193.3 49.5 49.4 117.9 80.2 193.2 80.2h3726.8c75.2 0 143.7-30.8 193.2-80.2 49.5-49.6 80.3-118 80.3-193.3v-467.1h-645.1c-26.7 0-50-14.2-63-35.4l-177.8-249.3-179.9-252.2q-2.1-2.85-3.9-5.7l-1-1.7-1-1.9-.1-.2-1.4-2.7-1.7-4-.5-1.1-1.5-4.2-.1-.3-.4-1.4v-.1c-1.5-4.9-2.4-9.9-2.8-15l-.2-3.4-.1-2.4.1-2.3.2-3.5c.4-5 1.3-10 2.8-15l.4-1.5.1-.2 1.5-4.3.5-1.1 1.7-3.9 1.4-2.7.1-.3 1-1.9 1-1.6q1.8-3 3.9-5.7l179.9-252.2 177.8-249.3c13-21.2 36.3-35.4 63-35.4h645.1v-723.8c0-75.2-30.8-143.7-80.3-193.2S4289 898 4213.8 898zM282.1 657.9l.9.9.2.3 1.7 1.8 3.7 4.1.9.9 1.9 2 2.3 2.3.6.6 6.6 6.3 1.5 1.4 1.2 1.1.3.3c46.8 42.2 108.1 68.6 175.5 70.5h3259.1V477c0-75.3-30.8-143.7-80.3-193.3-49.5-49.4 117.9-80.2-193.2-80.2H478.5v-.1c-73 2.2-139.1 33.5-187.1 82.7-48.1 49.3-77.9 116.8-77.9 190.9 0 69.2 26 132.6 68.6 180.9M4561 2042.8h-681.1l-158.7 222.5-150.4 210.9 150.4 211 158.7 222.5h906v-866.9zm-1139.5 389.4c4.5-6 9.9-11.4 16.3-15.9zm662.8-183.4c62.8 0 119.7 25.5 160.9 66.6 41.1 41.2 66.6 98.1 66.6 160.9s-25.5 119.7-66.6 160.8c-41.2 41.2-98.1 66.7-160.9 66.7s-119.7-25.5-160.8-66.7q-2.4-2.4-4.6-4.9c-38.5-40.8-62.1-95.8-62.1-155.9 0-62.6 25.5-119.4 66.8-160.7l-.1-.2c41.1-41.1 98-66.6 160.8-66.6m56.6 170.9a79.97 79.97 0 0 0-56.6-23.4c-22.1 0-42.1 9-56.6 23.4l-.1-.2-.1.2c-14.4 14.3-23.2 34.3-23.2 56.6 0 20.9 7.8 39.8 20.6 53.9l2.8 2.7c14.5 14.4 34.5 23.4 56.6 23.4s42.2-9 56.6-23.4c14.4-14.5 23.4-34.5 23.4-56.6s-9-42.2-23.4-56.6"
                />
                <defs>
                  <linearGradient id="brandGrad" x1="0" y1="0" x2="5000" y2="4008" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#7c3aed" />
                    <stop offset="1" stopColor="#4f46e5" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="login-brand__name">DSBD</span>
          </div>

          {/* Heading */}
          <div className="login-header">
            <h1 className="login-title">
              {mode === 'signin'
                ? (isBengali ? 'নিরাপদ অ্যাকাউন্ট সাইন ইন' : 'Secure Account Sign In')
                : (isBengali ? 'নতুন অ্যাকাউন্ট তৈরি করুন' : 'Create Your Account')}
            </h1>
            <p className="login-subtitle">
              {mode === 'signin'
                ? (isBengali ? 'আপনার ড্যাশবোর্ড অ্যাক্সেস করতে লগইন করুন' : 'Enter your credentials to access your financial dashboard')
                : (isBengali ? 'আপনার বাজেট এবং ঋণ ট্র্যাক করতে খাতা তৈরি করুন' : 'Set up your personal ledger to manage budgets and track loans')}
            </p>
          </div>

          {/* Form */}
          <form id="login-form" className="login-form" onSubmit={handleSubmit} noValidate>
            {/* Name field — signup only */}
            <div className={`login-field-wrap ${mode === 'signup' ? 'login-field-wrap--visible' : ''}`}>
              <div className="login-field">
                <label className="login-label" htmlFor="displayName">{isBengali ? 'পুরো নাম' : 'Full Name'}</label>
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
              <label className="login-label" htmlFor="email">{isBengali ? 'ইমেল ঠিকানা' : 'Email Address'}</label>
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
                <label className="login-label" htmlFor="password">{isBengali ? 'পাসওয়ার্ড' : 'Password'}</label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    id="forgot-password-btn"
                    className="login-forgot"
                    onClick={() => setShowForgotModal(true)}
                  >
                    {isBengali ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot password?'}
                  </button>
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
                  placeholder={mode === 'signup' ? (isBengali ? 'কমপক্ষে ৬ অক্ষরের' : 'Min. 6 characters') : '••••••••'}
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
            <button id="submit-login" type="submit" className="login-submit" disabled={loading}>
              {loading ? (
                <span className="login-spinner" />
              ) : (
                <>
                  {mode === 'signin' ? (isBengali ? 'সাইন ইন করুন' : 'Sign In') : (isBengali ? 'অ্যাকাউন্ট তৈরি করুন' : 'Create Account')}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Footer switch */}
          <p className="login-switch">
            {mode === 'signin'
              ? (isBengali ? 'অ্যাকাউন্ট নেই? ' : "Don't have an account? ")
              : (isBengali ? 'ইতিমধ্যে অ্যাকাউন্ট আছে? ' : 'Already have an account? ')}
            <button
              type="button"
              id="switch-mode"
              className="login-switch__btn"
              onClick={() => {
                if (mode === 'signin') {
                  setShowSignupModal(true)
                } else {
                  switchMode('signin')
                }
              }}
            >
              {mode === 'signin'
                ? (isBengali ? 'নিবন্ধন করুন' : 'Sign up')
                : (isBengali ? 'লগইন করুন' : 'Sign in')}
            </button>
          </p>
        </div>

        <p className="login-legal">
          {isBengali ? (
            <>
              চালিয়ে যাওয়ার মাধ্যমে, আপনি আমাদের <a href="#" onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }}>পরিষেবার শর্তাবলী</a> এবং <a href="#" onClick={(e) => { e.preventDefault(); setShowPrivacyModal(true); }}>গোপনীয়তা নীতিতে</a> সম্মত হচ্ছেন।
            </>
          ) : (
            <>
              By continuing, you agree to our{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }}>Terms of Service</a> and <a href="#" onClick={(e) => { e.preventDefault(); setShowPrivacyModal(true); }}>Privacy Policy</a>.
            </>
          )}
        </p>
      </div>

      {/* Settings Dock */}
      <div className={`login-settings-dock ${settingsExpanded ? 'login-settings-dock--expanded' : ''}`}>
        {settingsExpanded && (
          <>
            {/* Chatbot Button */}
            <button
              type="button"
              className="login-dock-btn"
              onClick={() => { setShowChatbotModal(true); setSettingsExpanded(false) }}
              aria-label="Open AI Chatbot"
              title={isBengali ? 'এআই সহকারী' : 'AI Assistant'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </button>

            {/* Language Button */}
            <button
              type="button"
              className="login-dock-btn"
              onClick={() => { setShowLangModal(true); setSettingsExpanded(false) }}
              aria-label="Change Language"
              title={isBengali ? 'ভাষা পরিবর্তন করুন' : 'Change Language'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </button>
          </>
        )}

        {/* Toggle Settings Gear */}
        <button
          type="button"
          className={`login-settings-btn ${settingsExpanded ? 'login-settings-btn--active' : ''}`}
          onClick={() => setSettingsExpanded(!settingsExpanded)}
          aria-label="Toggle Settings Menu"
        >
          {/* Wrapper span carries the spin — completely isolated from button transforms */}
          <span className="settings-gear">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════
          Language Selection Modal
      ══════════════════════════════════════════════════════ */}
      {showLangModal && (
        <div
          className="fp-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lang-title"
          onClick={(e) => { if (e.target === e.currentTarget) setShowLangModal(false) }}
        >
          <div className="fp-modal lang-modal">
            <button type="button" className="fp-close" onClick={() => setShowLangModal(false)} aria-label="Close">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>

            <h2 id="lang-title" className="fp-title">{isBengali ? 'ভাষা নির্বাচন করুন' : 'Select Language'}</h2>
            <p className="fp-message">{isBengali ? 'আপনার পছন্দের ভাষাটি বেছে নিন।' : 'Choose your preferred language.'}</p>

            <div className="lang-flag-row">
              {/* English / USA */}
              <button
                type="button"
                className={`lang-flag-card ${!isBengali ? 'lang-flag-card--active' : ''}`}
                onClick={() => { setIsBengali(false); setShowLangModal(false) }}
                aria-label="English"
              >
                {/* USA Flag SVG */}
                <svg viewBox="0 0 60 40" width="64" height="44" xmlns="http://www.w3.org/2000/svg" className="lang-flag-svg">
                  <rect width="60" height="40" fill="#B22234"/>
                  <rect y="3.08" width="60" height="3.08" fill="white"/>
                  <rect y="9.23" width="60" height="3.08" fill="white"/>
                  <rect y="15.38" width="60" height="3.08" fill="white"/>
                  <rect y="21.54" width="60" height="3.08" fill="white"/>
                  <rect y="27.69" width="60" height="3.08" fill="white"/>
                  <rect y="33.85" width="60" height="3.08" fill="white"/>
                  <rect width="24" height="21.54" fill="#3C3B6E"/>
                  {[0,1,2,3,4].map(row => [0,1,2,3,4,5].slice(0, row % 2 === 0 ? 6 : 5).map((col, i) => (
                    <circle key={`${row}-${i}`} cx={(row % 2 === 0 ? col * 4 + 2 : col * 4 + 4)} cy={row * 4 + 2.5} r="1" fill="white" />
                  )))}
                </svg>
                <span className="lang-flag-label">English</span>
                <span className="lang-flag-sub">United States</span>
              </button>

              {/* Bengali / Bangladesh */}
              <button
                type="button"
                className={`lang-flag-card ${isBengali ? 'lang-flag-card--active' : ''}`}
                onClick={() => { setIsBengali(true); setShowLangModal(false) }}
                aria-label="Bengali"
              >
                {/* Bangladesh Flag SVG */}
                <svg viewBox="0 0 60 40" width="64" height="44" xmlns="http://www.w3.org/2000/svg" className="lang-flag-svg">
                  <rect width="60" height="40" fill="#006A4E"/>
                  <circle cx="28" cy="20" r="12" fill="#F42A41"/>
                </svg>
                <span className="lang-flag-label">বাংলা</span>
                <span className="lang-flag-sub">Bangladesh</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          AI Chatbot Modal
      ══════════════════════════════════════════════════════ */}
      {showChatbotModal && (
        <div
          className="fp-overlay chatbot-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="chatbot-title"
          onClick={(e) => { if (e.target === e.currentTarget) setShowChatbotModal(false) }}
        >
          <div className="chatbot-modal">
            {/* Header */}
            <div className="chatbot-header">
              <div className="chatbot-avatar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
              </div>
              <div className="chatbot-header-text">
                <h2 id="chatbot-title" className="chatbot-title">{isBengali ? 'ডিএসবিডি এআই সহকারী' : 'DSBD AI Assistant'}</h2>
                <span className="chatbot-online">{isBengali ? '● অনলাইন' : '● Online'}</span>
              </div>
              <button type="button" className="fp-close chatbot-close" onClick={() => setShowChatbotModal(false)} aria-label="Close">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="chatbot-messages" id="chatbot-messages">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`chatbot-bubble chatbot-bubble--${msg.sender}`}>
                  {msg.sender === 'bot' && (
                    <span className="chatbot-bubble-avatar">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                      </svg>
                    </span>
                  )}
                  <span className="chatbot-bubble-text">{msg.text}</span>
                </div>
              ))}
              {isTyping && (
                <div className="chatbot-bubble chatbot-bubble--bot">
                  <span className="chatbot-bubble-avatar">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                    </svg>
                  </span>
                  <span className="chatbot-typing">
                    <span/><span/><span/>
                  </span>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="chatbot-input-row">
              <input
                className="chatbot-input"
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleChatSend()}
                placeholder={isBengali ? 'আপনার প্রশ্ন লিখুন…' : 'Type a message…'}
                aria-label="Chat input"
              />
              <button
                type="button"
                className="chatbot-send-btn"
                onClick={handleChatSend}
                disabled={!chatInput.trim() || isTyping}
                aria-label="Send"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          Forgot Password Modal
      ══════════════════════════════════════════════════════ */}
      {showForgotModal && (
        <div
          className="fp-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="fp-title"
          onClick={(e) => { if (e.target === e.currentTarget) setShowForgotModal(false) }}
        >
          <div className="fp-modal">
            {/* Close */}
            <button type="button" id="fp-close" className="fp-close" onClick={() => setShowForgotModal(false)} aria-label="Close">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>

            {/* Icon */}
            <div className="fp-icon-wrap">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="url(#fpGrad)" strokeWidth="1.6" />
                <path d="M12 7v6M12 15.5v1" stroke="url(#fpGrad)" strokeWidth="1.8" strokeLinecap="round" />
                <defs>
                  <linearGradient id="fpGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#7c3aed" />
                    <stop offset="1" stopColor="#818cf8" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <h2 id="fp-title" className="fp-title">Password Reset</h2>

            <p className="fp-message">
              To reset your password, please contact your{' '}
              <strong className="fp-highlight">Area Agent</strong>. They are authorised
              to verify your identity and initiate a secure password reset on your behalf.
            </p>

            <div className="fp-divider" />

            {/* CTA → opens agent finder */}
            <button
              type="button"
              id="find-agent-link"
              className="fp-agent-link"
              onClick={() => { setShowForgotModal(false); setShowAgentModal(true) }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="9" r="4" stroke="currentColor" strokeWidth="1.8" />
                <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <span className="fp-agent-link__text">Don't know your Area Agent?</span>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button type="button" id="fp-dismiss" className="fp-dismiss" onClick={() => setShowForgotModal(false)}>
              Got it
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          Sign Up Modal
      ══════════════════════════════════════════════════════ */}
      {showSignupModal && (
        <div
          className="fp-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="su-title"
          onClick={(e) => { if (e.target === e.currentTarget) setShowSignupModal(false) }}
        >
          <div className="fp-modal">
            {/* Close */}
            <button type="button" id="su-close" className="fp-close" onClick={() => setShowSignupModal(false)} aria-label="Close">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>

            {/* Icon */}
            <div className="fp-icon-wrap">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="url(#suGrad)" strokeWidth="1.6" />
                <path d="M12 7v6M12 15.5v1" stroke="url(#suGrad)" strokeWidth="1.8" strokeLinecap="round" />
                <defs>
                  <linearGradient id="suGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#7c3aed" />
                    <stop offset="1" stopColor="#818cf8" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <h2 id="su-title" className="fp-title">Account Creation</h2>

            <p className="fp-message">
              To create an account, please contact your{' '}
              <strong className="fp-highlight">Area Agent</strong>. They are authorised
              to register new users and set up your ledger.
            </p>

            <div className="fp-divider" />

            {/* CTA → opens agent finder */}
            <button
              type="button"
              id="su-find-agent-link"
              className="fp-agent-link"
              onClick={() => { setShowSignupModal(false); setShowAgentModal(true) }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="9" r="4" stroke="currentColor" strokeWidth="1.8" />
                <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <span className="fp-agent-link__text">Don't know your Area Agent?</span>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button type="button" id="su-dismiss" className="fp-dismiss" onClick={() => setShowSignupModal(false)}>
              Got it
            </button>
          </div>
        </div>
      )}



      {/* ══════════════════════════════════════════════════════
          Find Area Agent Modal
      ══════════════════════════════════════════════════════ */}
      {showAgentModal && (
        <div
          className="fa-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="fa-title"
          onClick={(e) => { if (e.target === e.currentTarget) setShowAgentModal(false) }}
        >
          <div className="fa-modal">
            {/* Close */}
            <button type="button" id="fa-close" className="fp-close fa-close" onClick={() => setShowAgentModal(false)} aria-label="Close">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>

            {/* Header */}
            <div className="fa-header">
              <div className="fa-header__icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="url(#faGrad)" strokeWidth="1.7" strokeLinejoin="round" />
                  <circle cx="12" cy="9" r="2.5" stroke="url(#faGrad)" strokeWidth="1.7" />
                  <defs>
                    <linearGradient id="faGrad" x1="5" y1="2" x2="19" y2="22" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#7c3aed" />
                      <stop offset="1" stopColor="#818cf8" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div>
                <h2 id="fa-title" className="fa-title">Find Your Area Agent</h2>
                <p className="fa-subtitle">Locate the agent responsible for your area</p>
              </div>
            </div>

            {/* GPS Section */}
            <div className="fa-gps-section">
              {gpsState === 'idle' && (
                <button type="button" id="fa-detect-btn" className="fa-detect-btn" onClick={handleDetectLocation}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                  </svg>
                  Detect My Location Automatically
                </button>
              )}

              {gpsState === 'requesting' && (
                <div className="fa-gps-status fa-gps-status--loading">
                  <span className="fa-spinner" />
                  <span>Detecting your location…</span>
                </div>
              )}

              {gpsState === 'granted' && detectedCity && (
                <div className="fa-gps-status fa-gps-status--success">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Location detected: <strong>{detectedCity}</strong></span>
                  <button type="button" className="fa-retry-btn" onClick={handleDetectLocation}>Retry</button>
                </div>
              )}

              {(gpsState === 'denied' || gpsState === 'unavailable') && (
                <div className="fa-gps-status fa-gps-status--error">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M8 5v3M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span>{geoError}</span>
                  <button type="button" className="fa-retry-btn" onClick={handleDetectLocation}>Retry</button>
                </div>
              )}
            </div>

            {/* Agent list — only shown after successful GPS */}
            {gpsState === 'granted' && nearbyAgents.length > 0 && (
              <div className="fa-agents-section">
                <p className="fa-agents-label">
                  {nearbyAgents.length} agent{nearbyAgents.length > 1 ? 's' : ''} serving <strong>{detectedCity}</strong>
                </p>
                <div className="fa-agents-list">
                  {nearbyAgents.map(agent => (
                    <div key={agent.id} className="fa-agent-card">
                      {/* Avatar */}
                      <div
                        className="fa-agent-avatar"
                        style={{ background: `linear-gradient(135deg, ${agent.badgeColor}cc, ${agent.badgeColor}66)`, borderColor: `${agent.badgeColor}55` }}
                      >
                        {agent.badge}
                      </div>

                      {/* Info */}
                      <div className="fa-agent-info">
                        <div className="fa-agent-name">{agent.name}</div>
                        <div className="fa-agent-title">{agent.title}</div>

                        {/* Areas covered */}
                        <div className="fa-agent-areas">
                          <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                            <path d="M8 1C5.24 1 3 3.24 3 6c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                            <circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.5" />
                          </svg>
                          <span>{agent.areas.join(' · ')}</span>
                        </div>

                        {/* Contact row */}
                        <div className="fa-agent-contacts">
                          <a href={`tel:${agent.phone}`} className="fa-contact-chip fa-contact-chip--phone">
                            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                              <path d="M3 2h3l1.5 3.5-1.5 1A9 9 0 0010.5 9l1-1.5L15 9v3a1 1 0 01-1 1C6.268 13 3 9.73 3 3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                            </svg>
                            {agent.phone}
                          </a>
                          <a href={`mailto:${agent.email}`} className="fa-contact-chip fa-contact-chip--email">
                            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                              <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.4" />
                              <path d="M1 6l7 4 7-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                            </svg>
                            Email
                          </a>
                        </div>

                        {/* Availability */}
                        <div className="fa-agent-avail">
                          <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" />
                            <path d="M8 5v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                          </svg>
                          {agent.availability}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No agent found for detected area */}
            {gpsState === 'granted' && nearbyAgents.length === 0 && detectedCity && (
              <div className="fa-empty-state">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="9" r="4" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
                  <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <p className="fa-empty-title">No agent found for <strong>{detectedCity}</strong></p>
                <p className="fa-empty-sub">
                  There is currently no assigned area agent for your location.
                  Please contact the DSBD helpline for assistance.
                </p>
              </div>
            )}

            {/* Footer note */}
            <p className="fa-footer-note">
              Area agents are available during office hours. For urgent matters, call the DSBD helpline.
            </p>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          Terms of Service Modal
      ══════════════════════════════════════════════════════ */}
      {showTermsModal && (
        <div
          className="fp-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="terms-title"
          onClick={(e) => { if (e.target === e.currentTarget) setShowTermsModal(false) }}
        >
          <div className="fp-modal policy-modal">
            <button type="button" className="fp-close" onClick={() => setShowTermsModal(false)} aria-label="Close">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
            
            {/* Icon */}
            <div className="fp-icon-wrap">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="3" width="14" height="18" rx="2" stroke="url(#termGrad)" strokeWidth="1.6" />
                <line x1="9" y1="8" x2="15" y2="8" stroke="url(#termGrad)" strokeWidth="1.6" strokeLinecap="round" />
                <line x1="9" y1="12" x2="15" y2="12" stroke="url(#termGrad)" strokeWidth="1.6" strokeLinecap="round" />
                <line x1="9" y1="16" x2="13" y2="16" stroke="url(#termGrad)" strokeWidth="1.6" strokeLinecap="round" />
                <defs>
                  <linearGradient id="termGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#7c3aed" />
                    <stop offset="1" stopColor="#818cf8" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <h2 id="terms-title" className="fp-title">{isBengali ? 'পরিষেবার শর্তাবলী' : 'Terms of Service'}</h2>
            <div className="policy-content">
              {isBengali ? (
                <>
                  <p><strong>১. ভূমিকা</strong><br/>DSBD প্ল্যাটফর্মে স্বাগতম। এই শর্তাবলী আপনার আমাদের পরিষেবা ব্যবহারের নিয়মাবলী নির্ধারণ করে।</p>
                  <p><strong>২. অ্যাকাউন্টের দায়িত্ব</strong><br/>আপনার অ্যাকাউন্টের নিরাপত্তা এবং তথ্যের গোপনীয়তা বজায় রাখার দায়িত্ব আপনার।</p>
                  <p><strong>৩. লেনদেন এবং ফি</strong><br/>সকল লেনদেন এবং ফি DSBD-এর নির্ধারিত নীতি অনুযায়ী পরিচালিত হবে।</p>
                  <p><strong>৪. পরিবর্তন</strong><br/>আমরা যেকোনো সময় এই শর্তাবলী আপডেট করার অধিকার রাখি।</p>
                </>
              ) : (
                <>
                  <p><strong>1. Introduction</strong><br/>Welcome to the DSBD platform. These terms govern your use of our services.</p>
                  <p><strong>2. Account Responsibilities</strong><br/>You are responsible for maintaining the security of your account and the confidentiality of your information.</p>
                  <p><strong>3. Transactions and Fees</strong><br/>All transactions and applicable fees will be managed according to DSBD's established policies.</p>
                  <p><strong>4. Modifications</strong><br/>We reserve the right to update these terms at any time.</p>
                </>
              )}
            </div>
            <button className="fp-dismiss" onClick={() => setShowTermsModal(false)}>
              {isBengali ? 'বুঝেছি' : 'Understood'}
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          Privacy Policy Modal
      ══════════════════════════════════════════════════════ */}
      {showPrivacyModal && (
        <div
          className="fp-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="privacy-title"
          onClick={(e) => { if (e.target === e.currentTarget) setShowPrivacyModal(false) }}
        >
          <div className="fp-modal policy-modal">
            <button type="button" className="fp-close" onClick={() => setShowPrivacyModal(false)} aria-label="Close">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
            
            {/* Icon */}
            <div className="fp-icon-wrap">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="url(#privGrad)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 12l2 2 4-4" stroke="url(#privGrad)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                  <linearGradient id="privGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#7c3aed" />
                    <stop offset="1" stopColor="#818cf8" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <h2 id="privacy-title" className="fp-title">{isBengali ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}</h2>
            <div className="policy-content">
              {isBengali ? (
                <>
                  <p><strong>১. তথ্য সংগ্রহ</strong><br/>আমরা আপনার অ্যাকাউন্ট তৈরি এবং পরিষেবা প্রদানের জন্য প্রয়োজনীয় তথ্য সংগ্রহ করি।</p>
                  <p><strong>২. তথ্যের ব্যবহার</strong><br/>আপনার তথ্য শুধুমাত্র আমাদের পরিষেবা উন্নত করতে এবং লেনদেন পরিচালনা করতে ব্যবহৃত হয়।</p>
                  <p><strong>৩. ডেটা নিরাপত্তা</strong><br/>আমরা আপনার তথ্য সুরক্ষিত রাখতে উন্নত নিরাপত্তা ব্যবস্থা প্রয়োগ করি।</p>
                  <p><strong>৪. তৃতীয় পক্ষ</strong><br/>আমরা আপনার অনুমতি ছাড়া তৃতীয় পক্ষের কাছে আপনার ব্যক্তিগত তথ্য বিক্রি করি না।</p>
                </>
              ) : (
                <>
                  <p><strong>1. Data Collection</strong><br/>We collect information necessary to create your account and provide our services.</p>
                  <p><strong>2. Use of Information</strong><br/>Your data is used solely to improve our services and manage your transactions.</p>
                  <p><strong>3. Data Security</strong><br/>We employ advanced security measures to keep your information safe.</p>
                  <p><strong>4. Third Parties</strong><br/>We do not sell your personal information to third parties without your explicit consent.</p>
                </>
              )}
            </div>
            <button className="fp-dismiss" onClick={() => setShowPrivacyModal(false)}>
              {isBengali ? 'বুঝেছি' : 'Understood'}
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
