import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { normalizeEmail, normalizePhone, validateLoginForm } from '../utils/authValidation'

const AUTH_HAS_ACCOUNT_KEY = 'kd_sarees_has_account'
const ADMIN_SESSION_KEY = 'kd_sarees_admin_session'
const ADMIN_TOKEN_KEY = 'kd_sarees_admin_token'
const USER_REFRESH_TOKEN_KEY = 'kd_sarees_refresh_token'
const ADMIN_REFRESH_TOKEN_KEY = 'kd_sarees_admin_refresh_token'
const highlightItems = [
  'Track your orders anytime',
  'Fast checkout with saved details',
  'Personalized saree recommendations',
]

export default function LoginPage({ isPopup = false, onClose }) {
  const navigate = useNavigate()
  const location = useLocation()
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://kd-sarees.onrender.com'

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const validationError = validateLoginForm(formData)
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setLoading(true)
      const trimmedIdentifier = formData.identifier.trim()
      const normalizedIdentifier = trimmedIdentifier.includes('@')
        ? normalizeEmail(trimmedIdentifier)
        : normalizePhone(trimmedIdentifier)
      const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: normalizedIdentifier,
          password: formData.password,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Unable to login')
      }

      localStorage.setItem('kd_sarees_token', data.token)
      if (data?.refreshToken) {
        localStorage.setItem(USER_REFRESH_TOKEN_KEY, data.refreshToken)
      }
      localStorage.setItem('kd_sarees_user', JSON.stringify(data.user))
      localStorage.setItem(AUTH_HAS_ACCOUNT_KEY, 'true')
      if (data?.user?.role === 'admin') {
        localStorage.setItem(ADMIN_SESSION_KEY, 'true')
        localStorage.setItem(ADMIN_TOKEN_KEY, data.token)
        if (data?.refreshToken) {
          localStorage.setItem(ADMIN_REFRESH_TOKEN_KEY, data.refreshToken)
        }
        navigate('/admin/dashboard', { replace: true })
      } else {
        localStorage.removeItem(ADMIN_SESSION_KEY)
        localStorage.removeItem(ADMIN_TOKEN_KEY)
        localStorage.removeItem(ADMIN_REFRESH_TOKEN_KEY)
        navigate('/profile', { replace: true })
      }
    } catch (err) {
      setError(err.message || 'Unable to login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-0 py-0 md:items-center md:px-4 md:py-8">
      <button
        type="button"
        onClick={onClose || (() => navigate('/'))}
        className="absolute inset-0 hidden bg-black/35 md:block"
        aria-label="Close login popup background"
      />

      <div className="relative z-[101] mx-auto h-full w-full overflow-y-auto bg-white md:h-auto md:max-h-[calc(100vh-2rem)] md:max-w-5xl md:rounded-2xl md:shadow-2xl">
        <div className="flex items-center justify-between px-5 pt-5 md:hidden">
          <p
            className="text-left text-4xl font-normal tracking-normal text-[#4a2f1f]"
            style={{ fontFamily: "'Great Vibes', cursive" }}
          >
            Kd Sarees
          </p>
          <button
            type="button"
            onClick={onClose || (() => navigate('/'))}
            className="text-2xl leading-none text-gray-400 transition hover:text-gray-700"
            aria-label="Close login page"
          >
            ×
          </button>
        </div>
        <button
          type="button"
          onClick={onClose || (() => navigate('/'))}
          className="absolute right-4 top-4 hidden text-2xl leading-none text-gray-400 transition hover:text-gray-700 md:block"
          aria-label="Close login popup"
        >
          ×
        </button>

        <div className="grid md:grid-cols-[1.2fr_1fr]">
          <section className="order-2 bg-[#f5e6c8] px-5 py-8 text-[#4a2f1f] md:order-1 md:rounded-l-2xl md:rounded-tr-none md:px-10 md:py-10">
            <p
              className="hidden text-5xl font-normal tracking-normal text-[#4a2f1f] md:block"
              style={{ fontFamily: "'Great Vibes', cursive" }}
            >
              Kd Sarees
            </p>
            <p className="mt-3 text-base font-medium text-[#5a3a28] sm:text-lg">Welcome back! Access your account in seconds.</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {highlightItems.map((item) => (
                <div
                  key={item}
                  className="flex min-h-[142px] flex-col items-center justify-center rounded-3xl bg-[#e9d4ad] px-3 py-5 text-center shadow-[inset_0_0_0_1px_rgba(74,47,31,0.12)]"
                >
                  <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-full border border-[#b48a62]/60 bg-[#fffaf2] text-[7px] text-[#6e452d]">
                    <span style={{ fontFamily: "'Great Vibes', cursive" }}>Kd</span>
                  </div>
                  <p className="max-w-[130px] text-sm font-semibold leading-tight text-[#4a2f1f] sm:text-base">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="order-1 bg-white px-5 py-8 md:order-2 md:rounded-r-2xl md:rounded-bl-none md:px-8 md:py-10">
            <h1 className="text-center text-2xl font-semibold text-gray-900 sm:text-3xl">Login Now!</h1>

            <form onSubmit={handleSubmit} className="mx-auto mt-6 w-full max-w-sm space-y-4">
              <div>
                <label htmlFor="identifier" className="mb-1 block text-sm font-medium text-gray-700">
                  Email or Mobile Number
                </label>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  value={formData.identifier}
                  onChange={handleChange}
                  required
                  placeholder="Enter Email or Mobile Number"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-[#0b3da2] focus:outline-none"
                />
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between gap-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    state={location.state}
                    className="text-xs font-medium text-[#0b3da2] hover:text-[#082c75]"
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  maxLength={64}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-[#0b3da2] focus:outline-none"
                />
              </div>

              {location.state?.passwordReset ? (
                <p className="text-sm text-green-700">Password updated. You can sign in with your new password.</p>
              ) : null}

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Signing in...' : 'Submit'}
              </button>
            </form>

            <p className="mx-auto mt-6 w-full max-w-sm text-center text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link
                to="/signup"
                state={location.state}
                onClick={() => localStorage.setItem(AUTH_HAS_ACCOUNT_KEY, 'false')}
                className="font-medium text-[#0b3da2] hover:text-[#082c75]"
              >
                Sign up
              </Link>
            </p>
            {!isPopup ? (
              <p className="mx-auto mt-3 w-full max-w-sm text-center text-xs text-gray-500">
                You can close this popup to continue browsing.
              </p>
            ) : null}
          </section>
        </div>
      </div>
    </div>
  )
}
