const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://kd-sarees.onrender.com'

const getUserToken = () => localStorage.getItem('kd_sarees_token')
const getAdminToken = () => localStorage.getItem('kd_sarees_admin_token')
const getUserRefreshToken = () => localStorage.getItem('kd_sarees_refresh_token')
const getAdminRefreshToken = () => localStorage.getItem('kd_sarees_admin_refresh_token')

const setTokens = ({ auth, token, refreshToken }) => {
  if (auth === 'admin') {
    if (token) localStorage.setItem('kd_sarees_admin_token', token)
    if (refreshToken) localStorage.setItem('kd_sarees_admin_refresh_token', refreshToken)
    return
  }
  if (auth === 'user') {
    if (token) localStorage.setItem('kd_sarees_token', token)
    if (refreshToken) localStorage.setItem('kd_sarees_refresh_token', refreshToken)
  }
}

const clearTokens = (auth) => {
  if (auth === 'admin') {
    localStorage.removeItem('kd_sarees_admin_token')
    localStorage.removeItem('kd_sarees_admin_refresh_token')
    localStorage.removeItem('kd_sarees_admin_session')
    return
  }
  if (auth === 'user') {
    localStorage.removeItem('kd_sarees_token')
    localStorage.removeItem('kd_sarees_refresh_token')
    localStorage.removeItem('kd_sarees_user')
  }
}

const refreshAccessToken = async (auth) => {
  const refreshToken = auth === 'admin' ? getAdminRefreshToken() : getUserRefreshToken()
  if (!refreshToken) {
    throw new Error('Session expired. Please login again.')
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok || !data?.token) {
    clearTokens(auth)
    throw new Error(data?.message || 'Session expired. Please login again.')
  }

  setTokens({ auth, token: data.token, refreshToken: data.refreshToken })
  return data.token
}

const request = async (path, { method = 'GET', body, auth = 'none', _retry = false } = {}) => {
  const headers = { 'Content-Type': 'application/json' }
  const token = auth === 'user' ? getUserToken() : auth === 'admin' ? getAdminToken() : null
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    if ((auth === 'user' || auth === 'admin') && response.status === 401 && !_retry) {
      try {
        await refreshAccessToken(auth)
        return request(path, { method, body, auth, _retry: true })
      } catch (refreshError) {
        throw new Error(refreshError.message || 'Session expired. Please login again.')
      }
    }
    throw new Error(data?.message || `Request failed (${response.status})`)
  }
  return data
}

export const api = {
  getProducts: (params = {}) => {
    const q = new URLSearchParams()
    if (params.category) q.set('category', params.category)
    const qs = q.toString()
    return request(`/api/products${qs ? `?${qs}` : ''}`)
  },
  createProduct: (payload) => request('/api/products', { method: 'POST', body: payload, auth: 'admin' }),
  updateProduct: (id, payload) => request(`/api/products/${id}`, { method: 'PUT', body: payload, auth: 'admin' }),
  deleteProduct: (id) => request(`/api/products/${id}`, { method: 'DELETE', auth: 'admin' }),
  getCategories: () => request('/api/categories'),
  createCategory: (payload) => request('/api/categories', { method: 'POST', body: payload, auth: 'admin' }),
  updateCategory: (id, payload) => request(`/api/categories/${id}`, { method: 'PUT', body: payload, auth: 'admin' }),
  deleteCategory: (id) => request(`/api/categories/${id}`, { method: 'DELETE', auth: 'admin' }),
  getAdminOffers: () => request('/api/offers/all', { auth: 'admin' }),
  createOffer: (payload) => request('/api/offers', { method: 'POST', body: payload, auth: 'admin' }),
  updateOffer: (id, payload) => request(`/api/offers/${id}`, { method: 'PUT', body: payload, auth: 'admin' }),
  deleteOffer: (id) => request(`/api/offers/${id}`, { method: 'DELETE', auth: 'admin' }),
  getReviews: () => request('/api/reviews'),
  deleteReview: (id) => request(`/api/reviews/${id}`, { method: 'DELETE', auth: 'admin' }),
  addReview: (payload) => request('/api/reviews', { method: 'POST', body: payload, auth: 'user' }),
  getCart: () => request('/api/cart', { auth: 'user' }),
  addToCart: (payload) => request('/api/cart/add', { method: 'POST', body: payload, auth: 'user' }),
  updateCartItem: (payload) => request('/api/cart/item', { method: 'PATCH', body: payload, auth: 'user' }),
  removeCartItem: (payload) => request(`/api/cart/item/${payload?.productId || ''}`, { method: 'DELETE', auth: 'user' }),
  clearCart: () => request('/api/cart/clear', { method: 'DELETE', auth: 'user' }),
  getFavorites: () => request('/api/favorites', { auth: 'user' }),
  addToFavorites: (payload) => request('/api/favorites/add', { method: 'POST', body: payload, auth: 'user' }),
  removeFavoriteItem: (payload) => request('/api/favorites/item', { method: 'DELETE', body: payload, auth: 'user' }),
  createOrder: (payload) => request('/api/orders', { method: 'POST', body: payload, auth: 'user' }),
  getMyOrders: () => request('/api/orders/my', { auth: 'user' }),
  createPayment: (orderId, payload) =>
    request(`/api/payments/order/${orderId}`, { method: 'POST', body: payload, auth: 'user' }),
  listUsers: (role) => {
    const q = role === 'admin' || role === 'user' ? `?role=${encodeURIComponent(role)}` : ''
    return request(`/api/users${q}`, { auth: 'admin' })
  },
  deleteUser: (id) => request(`/api/users/${id}`, { method: 'DELETE', auth: 'admin' }),
}
