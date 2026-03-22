import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import PasswordInput from '../components/PasswordInput'
import { isStrongPassword } from '../utils/authValidation'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://kd-sarees.onrender.com'

  const tokenFromUrl = searchParams.get('token') || ''
  const token = useMemo(
    () => String(location.state?.token || tokenFromUrl || '').trim(),
    [location.state?.token, tokenFromUrl]
  )

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!token) {
      setError('Reset link is invalid or expired. Request a new one from forgot password.')
      return
    }
    if (!isStrongPassword(password)) {
      setError('Password must be 8-64 characters with uppercase, lowercase, number, and special character.')
      return
    }
    if (password !== confirmPassword) {
      setError('Password and confirm password must match.')
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`${apiBaseUrl}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(data?.message || 'Unable to reset password')
      }
      navigate('/login', { replace: true, state: { ...location.state, passwordReset: true } })
    } catch (err) {
      setError(err.message || 'Unable to reset password')
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
          <h1 className="mt-4 text-center text-2xl font-semibold text-gray-900">Set new password</h1>
          <p className="mx-auto mt-2 max-w-sm text-center text-sm text-gray-600">
            Choose a strong password for your account.
          </p>

          {!token ? (
            <p className="mx-auto mt-8 max-w-sm text-center text-sm text-red-600">
              This reset link is missing or invalid.{' '}
              <Link to="/forgot-password" state={location.state} className="font-medium text-[#0b3da2] hover:text-[#082c75]">
                Request a new link
              </Link>
              .
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mx-auto mt-8 w-full max-w-sm space-y-4">
              <div>
                <label htmlFor="new-password" className="mb-1 block text-sm font-medium text-gray-700">
                  New password
                </label>
                <PasswordInput
                  id="new-password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  maxLength={64}
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-gray-300 pl-3 py-2.5 text-sm text-gray-900 focus:border-[#0b3da2] focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="confirm-new-password" className="mb-1 block text-sm font-medium text-gray-700">
                  Confirm password
                </label>
                <PasswordInput
                  id="confirm-new-password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  maxLength={64}
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-gray-300 pl-3 py-2.5 text-sm text-gray-900 focus:border-[#0b3da2] focus:outline-none"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Updating…' : 'Update password'}
              </button>
            </form>
          )}

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
