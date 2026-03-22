import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import PasswordInput from '../components/PasswordInput'
import { normalizeEmail, normalizeName, validateSignupForm } from '../utils/authValidation'

const AUTH_HAS_ACCOUNT_KEY = 'kd_sarees_has_account'
const PENDING_VERIFY_KEY = 'kd_sarees_email_verify_token'
const highlightItems = [
  'Create your account in one minute',
  'Get member-only festive offers',
  'Save favourites and reorder faster',
]
const seoBenefits = [
  'Shop silk, wedding, and festive sarees online.',
  'Get member offers and faster checkout.',
]

export default function SignupPage({ isPopup = false, onClose }) {
  const navigate = useNavigate()
  const location = useLocation()
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://kd-sarees.onrender.com'

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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
    const validationError = validateSignupForm(formData)
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`${apiBaseUrl}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: normalizeName(formData.name),
          email: normalizeEmail(formData.email),
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Unable to signup')
      }

      localStorage.setItem(AUTH_HAS_ACCOUNT_KEY, 'true')
      localStorage.removeItem('kd_sarees_token')
      localStorage.removeItem('kd_sarees_refresh_token')
      localStorage.removeItem('kd_sarees_user')
      localStorage.removeItem('kd_sarees_admin_token')
      localStorage.removeItem('kd_sarees_admin_refresh_token')
      localStorage.removeItem('kd_sarees_admin_session')
      if (data.verificationToken) {
        sessionStorage.setItem(PENDING_VERIFY_KEY, data.verificationToken)
      }
      navigate('/verify-email', { replace: true, state: location.state })
    } catch (err) {
      setError(err.message || 'Unable to signup')
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
        aria-label="Close signup popup background"
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
            aria-label="Close signup page"
          >
            ×
          </button>
        </div>
        <button
          type="button"
          onClick={onClose || (() => navigate('/'))}
          className="absolute right-4 top-4 hidden text-2xl leading-none text-gray-400 transition hover:text-gray-700 md:block"
          aria-label="Close signup popup"
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
            <p className="mt-3 text-base font-medium text-[#5a3a28] sm:text-lg">Join KD Sarees and start shopping smarter today!</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {highlightItems.map((item) => (
                <div
                  key={item}
                  className="flex min-h-[142px] flex-col items-center justify-center rounded-3xl bg-[#e9d4ad] px-3 py-5 text-center shadow-[inset_0_0_0_1px_rgba(74,47,31,0.12)]"
                >
                  <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-full border border-[#b48a62]/60 bg-[#fffaf2] text-[7px] text-[#6e452d]">
                    <span style={{ fontFamily: "'Great Vibes', cursive" }}>Kd</span>
                  </div>
                  <p className="max-w-[130px] break-words text-[10px] font-semibold leading-snug text-[#4a2f1f] sm:text-xs">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-[#c8a77a]/40 bg-[#f2dfbd] p-5">
              <h2 className="text-base font-semibold text-[#4a2f1f]">Why create your KD Sarees account?</h2>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[#5a3a28]">
                {seoBenefits.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span aria-hidden="true" className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-[#6e452d]" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="order-1 bg-white px-5 py-8 md:order-2 md:rounded-r-2xl md:rounded-bl-none md:px-8 md:py-10">
            <h1 className="text-center text-2xl font-semibold text-gray-900 sm:text-3xl">Create Account</h1>

            <form onSubmit={handleSubmit} className="mx-auto mt-6 w-full max-w-sm space-y-4">
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  minLength={2}
                  maxLength={60}
                  placeholder="Enter your full name"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-[#0b3da2] focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-[#0b3da2] focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                  Password
                </label>
                <PasswordInput
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  maxLength={64}
                  placeholder="Create your password"
                  className="w-full rounded-lg border border-gray-300 pl-3 py-2.5 text-sm text-gray-900 focus:border-[#0b3da2] focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <PasswordInput
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={8}
                  maxLength={64}
                  placeholder="Confirm your password"
                  className="w-full rounded-lg border border-gray-300 pl-3 py-2.5 text-sm text-gray-900 focus:border-[#0b3da2] focus:outline-none"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Creating account...' : 'Submit'}
              </button>
            </form>

            <p className="mx-auto mt-6 w-full max-w-sm text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                state={location.state}
                onClick={() => localStorage.setItem(AUTH_HAS_ACCOUNT_KEY, 'true')}
                className="font-medium text-[#0b3da2] hover:text-[#082c75]"
              >
                Login
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
