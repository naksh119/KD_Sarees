import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const ADMIN_SESSION_KEY = 'kd_sarees_admin_session'
const ADMIN_TOKEN_KEY = 'kd_sarees_admin_token'
const ADMIN_REFRESH_TOKEN_KEY = 'kd_sarees_admin_refresh_token'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://kd-sarees.onrender.com'
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [alreadyLoggedIn, setAlreadyLoggedIn] = useState(false)
  const [loading, setLoading] = useState(false)

  const openDashboardInNewTab = () => {
    const dashboardUrl = `${window.location.origin}/admin/dashboard`
    const newWindow = window.open(dashboardUrl, '_blank', 'noopener,noreferrer')
    if (!newWindow) {
      setError('Popup blocked. Please allow popups and click "Open Dashboard" again.')
      return
    }
    navigate('/', { replace: true })
  }

  useEffect(() => {
    if (localStorage.getItem(ADMIN_SESSION_KEY) === 'true') {
      setAlreadyLoggedIn(true)
    }
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!formData.email || !formData.password) {
      setError('Please enter admin email and password.')
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.message || 'Invalid admin credentials.')
      }

      if (data?.user?.role !== 'admin') {
        throw new Error('Admin access required.')
      }

      localStorage.setItem(ADMIN_SESSION_KEY, 'true')
      localStorage.setItem(ADMIN_TOKEN_KEY, data.token)
      if (data?.refreshToken) {
        localStorage.setItem(ADMIN_REFRESH_TOKEN_KEY, data.refreshToken)
      }
      openDashboardInNewTab()
    } catch (err) {
      setError(err.message || 'Invalid admin credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <section className="w-full max-w-md bg-white shadow-sm border border-gray-100 rounded-xl p-6 sm:p-8">
        <div className="text-center mb-6">
          <Link
            to="/"
            className="inline-block text-[#191970] text-4xl font-normal"
            style={{ fontFamily: "'Great Vibes', cursive" }}
          >
            Kd Sarees
          </Link>
          <h1 className="mt-4 text-2xl font-semibold text-gray-900">Admin Login</h1>
          <p className="mt-1 text-sm text-gray-600">Only authorized admins can access dashboard.</p>
        </div>

        {alreadyLoggedIn && (
          <div className="mb-4 rounded-lg border border-[#c4a77d]/35 bg-[#faf6f0] p-3">
            <p className="text-sm text-[#2c1810]">
              Admin session is active. Open dashboard in a new tab.
            </p>
            <button
              type="button"
              onClick={openDashboardInNewTab}
              className="mt-3 w-full rounded-lg bg-[#c4a77d] py-2.5 text-sm font-medium text-[#2c1810] transition-colors hover:bg-[#b8956a] focus:outline-none focus:ring-2 focus:ring-[#c4a77d]/40"
            >
              Open Dashboard
            </button>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Admin Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="admin@kdsarees.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-gray-900 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-gray-900 focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#c4a77d] py-2.5 text-sm font-medium text-[#2c1810] transition-colors hover:bg-[#b8956a] focus:outline-none focus:ring-2 focus:ring-[#c4a77d]/40 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Logging in...' : 'Login as Admin'}
          </button>
        </form>
      </section>
    </main>
  )
}
