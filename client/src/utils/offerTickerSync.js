export const OFFERS_INVALIDATE_STORAGE_KEY = 'kd_sarees_invalidate_offers'

/** Call after admin creates/updates/deletes an offer so open storefront tabs refetch immediately. */
export function notifyOffersInvalidated() {
  try {
    localStorage.setItem(OFFERS_INVALIDATE_STORAGE_KEY, String(Date.now()))
  } catch {
    // private mode / quota
  }
  window.dispatchEvent(new CustomEvent('kd-offers:invalidate'))
}
