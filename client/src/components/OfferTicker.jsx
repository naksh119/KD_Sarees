import { useEffect, useMemo, useState } from 'react'
import { api } from '../utils/api'
import { OFFERS_INVALIDATE_STORAGE_KEY } from '../utils/offerTickerSync.js'
import { setOfferTickerVisible } from '../utils/offerTickerVisibility.js'

const formatCountdown = (diffMs) => {
  if (diffMs <= 0) return 'Expired'
  const totalSeconds = Math.floor(diffMs / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(
    2,
    '0',
  )}s`
}

const getCountdownParts = (diffMs) => {
  if (diffMs <= 0) {
    return { isExpired: true, days: '00', hours: '00', minutes: '00', seconds: '00' }
  }
  const totalSeconds = Math.floor(diffMs / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return {
    isExpired: false,
    days: String(days).padStart(2, '0'),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  }
}

const buildTickerLine = (offer) => {
  if (!offer) return ''
  const parts = [offer.title?.trim(), offer.description?.trim()].filter(Boolean)
  let line = parts.join(' · ')
  const bits = []
  if (offer.discountPercent != null && offer.discountPercent !== '') {
    bits.push(`${offer.discountPercent}% OFF`)
  }
  if (offer.code) bits.push(`Code: ${offer.code}`)
  if (bits.length) {
    line = line ? `${line} — ${bits.join(' · ')}` : bits.join(' · ')
  }
  return line
}

export default function OfferTicker() {
  const [offers, setOffers] = useState([])
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const data = await api.getPublicOffers()
        setOffers(Array.isArray(data) ? data : [])
      } catch {
        setOffers([])
      }
    }

    fetchOffers()
    const intervalId = window.setInterval(fetchOffers, 8000)
    const onInvalidate = () => {
      fetchOffers()
    }
    const onStorage = (event) => {
      if (event.key === OFFERS_INVALIDATE_STORAGE_KEY) {
        fetchOffers()
      }
    }
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchOffers()
      }
    }
    window.addEventListener('kd-offers:invalidate', onInvalidate)
    window.addEventListener('storage', onStorage)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.clearInterval(intervalId)
      window.removeEventListener('kd-offers:invalidate', onInvalidate)
      window.removeEventListener('storage', onStorage)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  // API returns active offers sorted by updatedAt (most recently edited first).
  const featuredOffer = useMemo(() => {
    if (!offers.length) return null
    return offers[0]
  }, [offers])

  const hasDisplayableOffer = useMemo(() => {
    if (!featuredOffer) return false
    return Boolean(buildTickerLine(featuredOffer).trim())
  }, [featuredOffer])

  useEffect(() => {
    setOfferTickerVisible(hasDisplayableOffer)
    return () => setOfferTickerVisible(false)
  }, [hasDisplayableOffer])

  useEffect(() => {
    if (!hasDisplayableOffer) return undefined
    const timerId = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timerId)
  }, [hasDisplayableOffer])

  const featuredEnd = useMemo(() => {
    if (!featuredOffer?.endsAt) return null
    const endDate = new Date(featuredOffer.endsAt)
    return Number.isNaN(endDate.getTime()) ? null : endDate
  }, [featuredOffer])

  const tickerLine = useMemo(() => {
    if (!featuredOffer) return ''
    return buildTickerLine(featuredOffer)
  }, [featuredOffer])

  const rightCornerText = useMemo(() => {
    if (!featuredEnd) {
      return 'No end date'
    }
    return formatCountdown(featuredEnd.getTime() - now)
  }, [featuredEnd, now])

  const countdownParts = useMemo(() => {
    if (!featuredEnd) {
      return { isExpired: false, days: '--', hours: '--', minutes: '--', seconds: '--' }
    }
    return getCountdownParts(featuredEnd.getTime() - now)
  }, [featuredEnd, now])

  if (!hasDisplayableOffer) {
    return null
  }

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[70] w-full bg-[#0f172a] text-[#f5d76e] overflow-hidden">
        <div className="relative">
          <div className="py-2 px-3 sm:px-10 md:px-56 text-xs sm:text-sm tracking-wide text-center font-medium leading-snug line-clamp-2 md:line-clamp-1">
            {tickerLine}
          </div>
          <div className="hidden md:flex absolute left-0 top-0 h-full items-center bg-gradient-to-r from-[#0f172a] via-[#0f172a] to-transparent pr-8 pl-3">
            <div className="offer-countdown-badge flex w-[240px] items-center justify-center gap-2 rounded-full border border-[#f5d76e]/45 px-3 py-1.5 text-[11px] sm:text-xs font-semibold">
              <span className="offer-countdown-dot" />
              {rightCornerText === 'No end date' ? (
                <span className="w-[180px] text-center tracking-wide">No end date</span>
              ) : (
                <span className="w-[180px] text-center tracking-wide tabular-nums">
                  {countdownParts.isExpired
                    ? 'Expired'
                    : `${countdownParts.days}d ${countdownParts.hours}h ${countdownParts.minutes}m ${countdownParts.seconds}s`}
                </span>
              )}
            </div>
          </div>
          <div className="hidden md:flex absolute right-0 top-0 h-full items-center bg-gradient-to-l from-[#0f172a] via-[#0f172a] to-transparent pl-8 pr-3">
            <div className="offer-countdown-badge flex w-[240px] items-center justify-center gap-2 rounded-full border border-[#f5d76e]/45 px-3 py-1.5 text-[11px] sm:text-xs font-semibold">
              <span className="offer-countdown-dot" />
              {rightCornerText === 'No end date' ? (
                <span className="w-[180px] text-center tracking-wide">No end date</span>
              ) : (
                <span className="w-[180px] text-center tracking-wide tabular-nums">
                  {countdownParts.isExpired
                    ? 'Expired'
                    : `${countdownParts.days}d ${countdownParts.hours}h ${countdownParts.minutes}m ${countdownParts.seconds}s`}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="h-8" />
    </>
  )
}
