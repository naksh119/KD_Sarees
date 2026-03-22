/** Keeps Navbar offset in sync when OfferTicker shows/hides (no Context wrapper). */
let current = false
const listeners = new Set()

export function setOfferTickerVisible(visible) {
  current = Boolean(visible)
  listeners.forEach((fn) => fn(current))
}

export function subscribeOfferTickerVisible(fn) {
  fn(current)
  listeners.add(fn)
  return () => listeners.delete(fn)
}
