import { api } from './api';

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
  const favorites = getFavorites();
  return favorites.some((item) => item.id === productId);
}

export function toggleFavorite(product) {
  const favorites = getFavorites();
  const exists = favorites.some((item) => item.id === product.id);
  const hasUserToken = Boolean(localStorage.getItem('kd_sarees_token'));

  if (hasUserToken) {
    const productId = String(product?.id || '');
    if (productId) {
      const request = exists ? api.removeFavoriteItem({ productId }) : api.addToFavorites({ productId });
      request.catch(() => {
        // Local storage remains the source of truth when API fails.
      });
    }
  }

  const nextFavorites = exists
    ? favorites.filter((item) => item.id !== product.id)
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
      await api.removeFavoriteItem({ productId: normalizedProductId });
    } catch {
      // Keep local removal as fallback when server data is unavailable.
    }
  }

  const nextFavorites = getFavorites().filter((item) => String(item.id) !== normalizedProductId);
  saveFavorites(nextFavorites);
  window.dispatchEvent(new Event('favorites:changed'));
  return nextFavorites;
}
