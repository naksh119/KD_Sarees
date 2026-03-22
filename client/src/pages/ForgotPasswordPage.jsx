import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { isValidEmail, normalizeEmail } from '../utils/authValidation'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://kd-sarees.onrender.com'

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')
    const normalized = normalizeEmail(email)
    if (!isValidEmail(normalized)) {
      setError('Enter a valid email address.')
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`${apiBaseUrl}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalized }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(data?.message || 'Unable to process request')
      }
      setInfo(data?.message || 'If an account exists for this email, you will receive reset instructions.')
      if (data?.resetToken) {
        navigate('/reset-password', {
          replace: true,
          state: { ...location.state, token: data.resetToken },
        })
      }
    } catch (err) {
      setError(err.message || 'Unable to process request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-0 py-0 md:items-center md:px-4 md:py-8">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="absolute inset-0 hidden bg-black/35 md:block"
        aria-label="Close background"
      />
      <div className="relative z-[101] mx-auto h-full w-full overflow-y-auto bg-white md:h-auto md:max-h-[calc(100vh-2rem)] md:max-w-lg md:rounded-2xl md:shadow-2xl">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="absolute right-4 top-4 text-2xl leading-none text-gray-400 transition hover:text-gray-700"
          aria-label="Close"
        >
          ×
        </button>
        <div className="px-5 py-10 md:px-10 md:py-12">
          <p
            className="text-center text-4xl font-normal text-[#4a2f1f] md:text-5xl"
            style={{ fontFamily: "'Great Vibes', cursive" }}
          >
            Kd Sarees
          </p>
          <h1 className="mt-4 text-center text-2xl font-semibold text-gray-900">Forgot password</h1>
          <p className="mx-auto mt-2 max-w-sm text-center text-sm text-gray-600">
            Enter the email you used to register. We will send reset steps if an account exists.
          </p>

          <form onSubmit={handleSubmit} className="mx-auto mt-8 w-full max-w-sm space-y-4">
            <div>
              <label htmlFor="forgot-email" className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="forgot-email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-[#0b3da2] focus:outline-none"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {info && !error && <p className="text-sm text-green-700">{info}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Sending…' : 'Send reset link'}
            </button>
          </form>

          <p className="mx-auto mt-8 max-w-sm text-center text-sm text-gray-600">
            <Link to="/login" state={location.state} className="font-medium text-[#0b3da2] hover:text-[#082c75]">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
