import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'

const PENDING_VERIFY_KEY = 'kd_sarees_email_verify_token'

export default function VerifyEmailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://kd-sarees.onrender.com'

  // Secret token from link / session — used only for auto-verify, never shown in the UI.
  const autoVerifyToken = useMemo(() => {
    const q = String(searchParams.get('token') || '').trim()
    const fromState = String(location.state?.verificationToken || '').trim()
    const fromSession = String(sessionStorage.getItem(PENDING_VERIFY_KEY) || '').trim()
    return q || fromState || fromSession
  }, [searchParams, location.state?.verificationToken])

  const hasAutoToken = Boolean(String(autoVerifyToken || '').trim())

  const [manualToken, setManualToken] = useState('')
  // Start in loading when we will auto-verify so we never flash the empty token form.
  const [loading, setLoading] = useState(hasAutoToken)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const authHeader = () => {
    const t = localStorage.getItem('kd_sarees_token')
    return t ? { Authorization: `Bearer ${t}` } : {}
  }

  const refreshUserAfterVerify = useCallback(async () => {
    const t = localStorage.getItem('kd_sarees_token')
    if (!t) return
    try {
      const res = await fetch(`${apiBaseUrl}/api/auth/me`, { headers: { ...authHeader() } })
      const data = await res.json().catch(() => null)
      if (res.ok && data) {
        localStorage.setItem('kd_sarees_user', JSON.stringify(data))
      }
    } catch {
      /* ignore */
    }
  }, [apiBaseUrl])

  const verifyWithToken = useCallback(
    async (rawToken) => {
      const trimmed = String(rawToken || '').trim()
      if (!trimmed) {
        setError('Verification token is missing.')
        setLoading(false)
        return
      }
      setError('')
      setLoading(true)
      try {
        const response = await fetch(`${apiBaseUrl}/api/auth/verify-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: trimmed }),
        })
        const data = await response.json().catch(() => ({}))
        if (!response.ok) {
          throw new Error(data?.message || 'Verification failed')
        }
        sessionStorage.removeItem(PENDING_VERIFY_KEY)
        setSuccess(true)
        await refreshUserAfterVerify()
      } catch (err) {
        setError(err.message || 'Verification failed')
      } finally {
        setLoading(false)
      }
    },
    [apiBaseUrl, refreshUserAfterVerify]
  )

  const autoVerifyStarted = useRef(false)
  useEffect(() => {
    if (autoVerifyStarted.current) return
    const auto = String(autoVerifyToken || '').trim()
    if (!auto) return
    autoVerifyStarted.current = true
    verifyWithToken(auto)
  }, [autoVerifyToken, verifyWithToken])

  const handleManualSubmit = async (e) => {
    e.preventDefault()
    await verifyWithToken(manualToken)
  }

  // Show paste form only when there is no link/session token, or auto-verify failed.
  const showManualTokenForm = !hasAutoToken || Boolean(error)

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
          <h1 className="mt-4 text-center text-2xl font-semibold text-gray-900">Verify your email</h1>
          <p className="mx-auto mt-2 max-w-sm text-center text-sm text-gray-600">
            {showManualTokenForm
              ? 'Paste the verification token from your email, or use the link we sent you.'
              : 'Hang on — we are confirming your email now.'}
          </p>

          {success ? (
            <div className="mx-auto mt-8 max-w-sm space-y-4 text-center">
              <p className="text-sm font-medium text-green-700">Your email is verified.</p>
              <Link
                to="/login"
                state={location.state}
                className="inline-block w-full rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-900"
              >
                Continue to login
              </Link>
            </div>
          ) : showManualTokenForm ? (
            <form onSubmit={handleManualSubmit} className="mx-auto mt-8 w-full max-w-sm space-y-4">
              <div>
                <label htmlFor="verify-token" className="mb-1 block text-sm font-medium text-gray-700">
                  Verification token
                </label>
                <textarea
                  id="verify-token"
                  name="token"
                  value={manualToken}
                  onChange={(e) => setManualToken(e.target.value)}
                  rows={3}
                  placeholder="Paste token from your email"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-[#0b3da2] focus:outline-none"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={loading || !String(manualToken).trim()}
                className="w-full rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Verifying…' : 'Verify email'}
              </button>
            </form>
          ) : (
            <div className="mx-auto mt-10 max-w-sm text-center">
              <p className="text-sm text-gray-600">{loading ? 'Verifying…' : 'Almost done…'}</p>
            </div>
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
