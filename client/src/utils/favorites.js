import { api } from './api';
import { mapFavoriteDocToCards } from './mapProduct';

const FAVORITES_STORAGE_KEY = 'kd_sarees_favorites';

export function getFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveFavorites(favorites) {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
}

export function isFavoriteProduct(productId) {
  const idStr = String(productId ?? '');
  const favorites = getFavorites();
  return favorites.some((item) => String(item.id) === idStr);
}

/** When logged in, replaces local list with server state (fixes drift after parallel toggles). */
export async function syncFavoritesFromServer() {
  if (!localStorage.getItem('kd_sarees_token')) return getFavorites();
  try {
    const doc = await api.getFavorites();
    const next = mapFavoriteDocToCards(doc);
    saveFavorites(next);
    window.dispatchEvent(new Event('favorites:changed'));
    return next;
  } catch {
    return getFavorites();
  }
}

export async function toggleFavorite(product) {
  const idStr = String(product?.id ?? '');
  const favorites = getFavorites();
  const exists = favorites.some((item) => String(item.id) === idStr);
  const hasUserToken = Boolean(localStorage.getItem('kd_sarees_token'));

  if (hasUserToken && idStr) {
    try {
      const doc = exists
        ? await api.removeFavoriteItem({ productId: idStr })
        : await api.addToFavorites({ productId: idStr });
      const next = mapFavoriteDocToCards(doc);
      saveFavorites(next);
      window.dispatchEvent(new Event('favorites:changed'));
      return next;
    } catch {
      // Fall back to local-only toggle if the API is unavailable.
    }
  }

  const nextFavorites = exists
    ? favorites.filter((item) => String(item.id) !== idStr)
    : [product, ...favorites];

  saveFavorites(nextFavorites);
  window.dispatchEvent(new Event('favorites:changed'));
  return nextFavorites;
}

export async function removeFavoriteById(productId) {
  const normalizedProductId = String(productId || '');
  if (!normalizedProductId) return getFavorites();

  const hasUserToken = Boolean(localStorage.getItem('kd_sarees_token'));
  if (hasUserToken) {
    try {
      const doc = await api.removeFavoriteItem({ productId: normalizedProductId });
      const next = mapFavoriteDocToCards(doc);
      saveFavorites(next);
      window.dispatchEvent(new Event('favorites:changed'));
      return next;
    } catch {
      // Keep local removal as fallback when server data is unavailable.
    }
  }

  const nextFavorites = getFavorites().filter((item) => String(item.id) !== normalizedProductId);
  saveFavorites(nextFavorites);
  window.dispatchEvent(new Event('favorites:changed'));
  return nextFavorites;
}
