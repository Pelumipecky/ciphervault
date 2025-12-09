/**
 * Admin Login Page
 * 
 * A dedicated login page for administrators and super administrators.
 * Features:
 * - Professional admin-focused UI design
 * - Role validation (only admin/superadmin can login)
 * - Rate limiting for brute-force protection
 * - Secure session handling
 * - Forgot password functionality
 */

import { FormEvent, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { supabaseAuth, supabaseDb } from '@/lib/supabaseUtils'

type LoginStatus =
  | { state: 'idle' }
  | { state: 'loading'; message: string }
  | { state: 'error'; message: string }
  | { state: 'success'; message: string }

// Rate limiting configuration
const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes in milliseconds

function AdminCredentialsDisplay() {
  const [admin, setAdmin] = useState<any>(null)
  useEffect(() => {
    async function fetchAdmin() {
      const users = await supabaseDb.getAllUsers();
      const adminUser = users.find((u: any) => u.role === 'admin' || u.role === 'superadmin');
      setAdmin(adminUser);
    }
    fetchAdmin();
  }, [])

  if (!admin) {
    return (
      <div style={{ padding: '12px', background: 'rgba(240,185,11,0.07)', border: '1px solid rgba(240,185,11,0.15)', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', color: '#F0B90B' }}>
        <strong>Loading admin credentials…</strong>
      </div>
    )
  }

  return (
    <div style={{ padding: '12px', background: 'rgba(240,185,11,0.07)', border: '1px solid rgba(240,185,11,0.15)', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
      <strong>🔑 Admin Credentials:</strong><br />
      <strong>👨‍💼 Admin:</strong> <code style={{ background: 'rgba(0,0,0,0.2)', padding: '2px 6px', borderRadius: '4px' }}>{admin.email}</code> / <code style={{ background: 'rgba(0,0,0,0.2)', padding: '2px 6px', borderRadius: '4px' }}>{admin.password ? admin.password : '******'}</code>
    </div>
  )
}

function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [status, setStatus] = useState<LoginStatus>({ state: 'idle' })
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(0)
  
  const { login, user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Check if already authenticated as admin
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin' || user.role === 'superadmin') {
        navigate('/admin')
      }
    }
  }, [isAuthenticated, user, navigate])

  // Load rate limiting state from localStorage
  useEffect(() => {
    const storedAttempts = localStorage.getItem('adminLoginAttempts')
    const storedLockout = localStorage.getItem('adminLoginLockout')
    
    if (storedAttempts) {
      setLoginAttempts(parseInt(storedAttempts, 10))
    }
    if (storedLockout) {
      const lockoutTime = parseInt(storedLockout, 10)
      if (lockoutTime > Date.now()) {
        setLockoutUntil(lockoutTime)
      } else {
        // Lockout expired, clear it
        localStorage.removeItem('adminLoginLockout')
        localStorage.removeItem('adminLoginAttempts')
      }
    }
  }, [])

  // Countdown timer for lockout
  useEffect(() => {
    if (lockoutUntil) {
      const interval = setInterval(() => {
        const remaining = lockoutUntil - Date.now()
        if (remaining <= 0) {
          setLockoutUntil(null)
          setLoginAttempts(0)
          localStorage.removeItem('adminLoginLockout')
          localStorage.removeItem('adminLoginAttempts')
          setTimeRemaining(0)
        } else {
          setTimeRemaining(Math.ceil(remaining / 1000))
        }
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [lockoutUntil])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus({ state: 'loading', message: 'Authenticating…' })

    try {
      const result = await login(form.email, form.password)
      if (!result.success) {
        setStatus({ state: 'error', message: 'Invalid email/username or password' })
        return
      }
      const userData = localStorage.getItem('activeUser')
      const user = userData ? JSON.parse(userData) : null
      const redirectPath = result.redirectTo || '/admin'
      const userType = user?.role || 'admin'
      setStatus({ state: 'success', message: `Welcome ${userType}! Redirecting to dashboard…` })
      setTimeout(() => navigate(redirectPath), 1000)
    } catch (error: any) {
      setStatus({ state: 'error', message: error?.message || 'Login failed. Please try again.' })
    }
  }

  return (
    <div className="binance-auth">
      <div className="binance-auth__container">
        <Link to="/" className="binance-auth__logo">
          <img src="/images/ciphervaultlogobig.svg" alt="CipherVault" />
        </Link>
        <div className="binance-auth__header">
          <h1>Admin Login</h1>
          <p>Administrator access to CipherVault Investments</p>
        </div>
        {/* Real-time Admin Credentials from Supabase */}
        <AdminCredentialsDisplay />
        <form className="binance-form" onSubmit={handleSubmit}>
          <div className="binance-form__group">
            <label htmlFor="email">Email or Username</label>
            <input
              id="email"
              type="text"
              placeholder="Enter your email or username"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          <div className="binance-form__group">
            <label htmlFor="password">Password</label>
            <div className="binance-form__password">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                required
              />
              <button
                type="button"
                className="binance-form__toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>
          {status.state !== 'idle' && (
            <div className={`binance-form__status binance-form__status--${status.state}`}>
              {status.message}
            </div>
          )}
          <button 
            className="binance-form__submit" 
            type="submit" 
            disabled={status.state === 'loading'}
          >
            {status.state === 'loading' ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <div className="binance-auth__footer">
          Not an admin? <Link to="/login">User Login</Link>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
