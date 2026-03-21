import { useEffect, useMemo, useState } from 'react'

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

export default function OfferTicker() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://kd-sarees.onrender.com'
  const [offers, setOffers] = useState([])
  const [now, setNow] = useState(Date.now())
  const fixedOfferText = 'Holi Special - Summer Holi 20% OFF Code: 2001'

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/offers`)
        const data = await response.json()
        if (!response.ok) {
          return
        }
        setOffers(Array.isArray(data) ? data : [])
      } catch {
        setOffers([])
      }
    }

    fetchOffers()
    const intervalId = window.setInterval(fetchOffers, 20000)
    return () => window.clearInterval(intervalId)
  }, [apiBaseUrl])

  useEffect(() => {
    const timerId = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timerId)
  }, [])

  const nearestEndingOffer = useMemo(() => {
    const nowDate = new Date(now)
    const withValidEndDate = offers
      .filter((offer) => offer?.endsAt)
      .map((offer) => ({ offer, endDate: new Date(offer.endsAt) }))
      .filter((item) => !Number.isNaN(item.endDate.getTime()) && item.endDate > nowDate)
      .sort((a, b) => a.endDate - b.endDate)

    return withValidEndDate[0] || null
  }, [offers, now])

  const rightCornerText = useMemo(() => {
    if (!nearestEndingOffer) {
      return 'No end date'
    }
    const countdown = formatCountdown(nearestEndingOffer.endDate.getTime() - now)
    return countdown
  }, [nearestEndingOffer, now])

  const countdownParts = useMemo(() => {
    if (!nearestEndingOffer) {
      return { isExpired: false, days: '--', hours: '--', minutes: '--', seconds: '--' }
    }
    return getCountdownParts(nearestEndingOffer.endDate.getTime() - now)
  }, [nearestEndingOffer, now])

  return (
    <div className="sticky top-0 z-[60] relative w-full bg-[#0f172a] text-[#f5d76e] overflow-hidden">
      <div className="py-2 text-xs sm:text-sm tracking-wide text-center font-medium">{fixedOfferText}</div>
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
  )
}
