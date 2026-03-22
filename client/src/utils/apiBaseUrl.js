const FALLBACK = 'https://kd-sarees.onrender.com'

/**
 * Resolves the API origin for browser requests.
 * Ignores localhost URLs in production builds (common Netlify misconfiguration).
 */
export function getApiBaseUrl() {
  const raw = import.meta.env.VITE_API_BASE_URL?.trim()
  const base = (() => {
    if (!raw) return FALLBACK
    if (import.meta.env.PROD && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/?$/i.test(raw)) {
      return FALLBACK
    }
    return raw
  })()
  return base.replace(/\/+$/, '')
}
