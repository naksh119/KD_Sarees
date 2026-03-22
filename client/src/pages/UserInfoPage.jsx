import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaBoxOpen, FaHeart, FaMapMarkerAlt, FaSignOutAlt, FaUserCircle } from 'react-icons/fa'
import { IoArrowBack } from 'react-icons/io5'
import Navbar from '../components/Navbar'
import ConfirmPopup from '../components/ConfirmPopup'
import ProductCard from '../components/ProductCard'
import { api } from '../utils/api'
import { getFavorites, removeFavoriteById, toggleFavorite } from '../utils/favorites'

const ADMIN_SESSION_KEY = 'kd_sarees_admin_session'
const USER_TOKEN_KEY = 'kd_sarees_token'
const USER_REFRESH_TOKEN_KEY = 'kd_sarees_refresh_token'
const USER_PROFILE_KEY = 'kd_sarees_user'

/** Keeps the storefront visible (dimmed) behind the login modal after logout. */
const LOGIN_OVERLAY_BACKGROUND = {
  pathname: '/',
  search: '',
  hash: '',
  state: null,
  key: 'login-overlay-bg',
}

export default function UserInfoPage() {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('orders')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [orders, setOrders] = useState([])
  const [favorites, setFavorites] = useState([])
  const [deleteFavoriteTarget, setDeleteFavoriteTarget] = useState(null)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const token = localStorage.getItem(USER_TOKEN_KEY)
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://kd-sarees.onrender.com'

  useEffect(() => {
    const syncFavorites = () => {
      setFavorites(getFavorites())
    }

    syncFavorites()
    window.addEventListener('favorites:changed', syncFavorites)
    return () => window.removeEventListener('favorites:changed', syncFavorites)
  }, [])

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        navigate('/login', { replace: true, state: { backgroundLocation: LOGIN_OVERLAY_BACKGROUND } })
        return
      }

      try {
        setLoading(true)
        const response = await fetch(`${apiBaseUrl}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data?.message || 'Unable to fetch profile')
        }

        localStorage.setItem('kd_sarees_user', JSON.stringify(data))
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          gender: data.gender || '',
          dateOfBirth: data.dateOfBirth ? String(data.dateOfBirth).slice(0, 10) : '',
          addressLine1: data.addressLine1 || '',
          addressLine2: data.addressLine2 || '',
          city: data.city || '',
          state: data.state || '',
          country: data.country || '',
          pincode: data.pincode || '',
        })
        const myOrders = await api.getMyOrders()
        setOrders(Array.isArray(myOrders) ? myOrders : [])
      } catch (err) {
        setError(err.message || 'Unable to fetch profile')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [apiBaseUrl, navigate, token])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogout = () => {
    localStorage.removeItem(USER_TOKEN_KEY)
    localStorage.removeItem(USER_REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_PROFILE_KEY)
    setShowLogoutConfirm(false)
    navigate('/login', { replace: true, state: { backgroundLocation: LOGIN_OVERLAY_BACKGROUND } })
  }

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key !== ADMIN_SESSION_KEY) {
        return
      }
      if (event.newValue === null || event.newValue === 'false') {
        localStorage.removeItem(USER_TOKEN_KEY)
        localStorage.removeItem(USER_REFRESH_TOKEN_KEY)
        localStorage.removeItem(USER_PROFILE_KEY)
        setShowLogoutConfirm(false)
        navigate('/login', { replace: true, state: { backgroundLocation: LOGIN_OVERLAY_BACKGROUND } })
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [navigate])

  const handleSave = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    try {
      setSaving(true)
      const response = await fetch(`${apiBaseUrl}/api/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth || null,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          pincode: formData.pincode,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Unable to update profile')
      }

      localStorage.setItem('kd_sarees_user', JSON.stringify(data.user))
      setMessage('Profile updated successfully')
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message || 'Unable to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteFavorite = async (product) => {
    const nextFavorites = await removeFavoriteById(product?.id)
    setFavorites(nextFavorites)
    setDeleteFavoriteTarget(null)
  }

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-130px)] bg-[#f7f7f8] px-4 py-3 md:px-8 lg:px-10">
        <div className="max-w-[1280px] mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-black transition-colors"
          >
            <IoArrowBack className="text-base" />
            Continue Shopping
          </Link>

          <section className="mt-3 rounded-xl border border-gray-200 bg-white p-4 sm:p-5 lg:p-6">
            <div className="flex flex-col gap-6 lg:flex-row">
              <aside className="w-full lg:w-72">
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setActiveSection('profile')}
                    className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium border transition ${
                      activeSection === 'profile'
                        ? 'bg-[#faf6f0] border-[#c4a77d] text-[#2c1810]'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FaUserCircle />
                    My Profile
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveSection('addresses')}
                    className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium border transition ${
                      activeSection === 'addresses'
                        ? 'bg-[#faf6f0] border-[#c4a77d] text-[#2c1810]'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FaMapMarkerAlt />
                    My Addresses
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveSection('orders')}
                    className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium border transition ${
                      activeSection === 'orders'
                        ? 'bg-[#faf6f0] border-[#c4a77d] text-[#2c1810]'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FaBoxOpen />
                    My Orders
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveSection('favorites')}
                    className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium border transition ${
                      activeSection === 'favorites'
                        ? 'bg-[#faf6f0] border-[#c4a77d] text-[#2c1810]'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FaHeart className="text-red-600 shrink-0" />
                    Favorites
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full flex items-center gap-3 rounded-lg border border-[#c4a77d] bg-[#c4a77d] px-4 py-3 text-sm font-medium text-[#2c1810] transition-colors hover:bg-[#b8956a] focus:outline-none focus:ring-2 focus:ring-[#c4a77d]/40"
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </div>
              </aside>

              <div className="min-w-0 flex-1 overflow-hidden rounded-lg border border-gray-200 bg-white">
                {activeSection === 'orders' && (
                  <div className="flex h-full min-h-[420px] flex-col">
                    <div className="border-b border-[#b8956a]/45 bg-[#c4a77d] px-4 py-3 sm:px-6 sm:py-3.5">
                      <h2 className="text-lg font-semibold text-[#2c1810]">My Orders</h2>
                    </div>

                    {loading ? (
                      <div
                        className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-16"
                        role="status"
                        aria-live="polite"
                        aria-label="Loading orders"
                      >
                        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-[#c4a77d] border-r-[#c4a77d]/40" />
                        <p className="text-sm text-slate-500">Loading orders…</p>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 text-center sm:py-10">
                        <div className="mb-4 rounded-full border border-[#c4a77d]/35 bg-[#faf6f0] p-4 text-[#c4a77d]">
                          <FaBoxOpen className="text-4xl" />
                        </div>
                        <p className="text-gray-800">You haven&apos;t placed any orders yet.</p>
                        <p className="mt-1 text-gray-600">We can&apos;t wait to have you as a customer.</p>
                        <p className="mt-6 text-base font-semibold text-gray-800">Take a look at our products here</p>
                        <Link
                          to="/"
                          className="mt-6 inline-flex items-center rounded-lg bg-[#c4a77d] px-6 py-2.5 text-sm font-medium text-[#2c1810] transition-colors hover:bg-[#b8956a] focus:outline-none focus:ring-2 focus:ring-[#c4a77d]/40"
                        >
                          view products
                        </Link>
                      </div>
                    ) : (
                      <div className="grid flex-1 grid-cols-1 gap-3 px-4 py-5 sm:px-6 sm:py-6">
                        {orders.map((order) => (
                          <article key={order._id} className="rounded-lg border border-gray-200 p-3">
                            <p className="text-sm font-medium">Order #{String(order._id).slice(-8).toUpperCase()}</p>
                            <p className="text-xs text-gray-600">Status: {order.status}</p>
                            <p className="text-xs text-gray-600">Payment: {order.paymentStatus}</p>
                            <p className="text-sm font-semibold mt-1">Rs. {Number(order.totalAmount || 0).toLocaleString('en-IN')}</p>
                          </article>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeSection === 'favorites' && (
                  <div className="flex min-h-[420px] flex-col">
                    <div className="border-b border-[#b8956a]/45 bg-[#c4a77d] px-4 py-3 sm:px-6 sm:py-3.5">
                      <h2 className="text-lg font-semibold text-[#2c1810]">Favorites</h2>
                    </div>
                    {favorites.length === 0 ? (
                      <div className="mx-4 mt-6 rounded-lg border border-gray-200 bg-gray-50 p-5 text-sm text-gray-700 sm:mx-6">
                        No favorites yet. Tap the heart on any product card to save it here.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4 px-4 py-5 sm:grid-cols-2 sm:px-6 sm:py-6 lg:grid-cols-3">
                        {favorites.map((product) => (
                          <ProductCard
                            key={product.id}
                            id={product.id}
                            imageSrc={product.imageSrc}
                            imageSrcHover={product.imageSrcHover}
                            imageAlt={product.imageAlt}
                            productTitle={product.productTitle}
                            originalPrice={product.originalPrice}
                            currentPrice={product.currentPrice}
                            discountPercentage={product.discountPercentage}
                            rating={product.rating}
                            reviewCount={product.reviewCount}
                            isSale={product.isSale}
                            showAddToCartButton={product.showAddToCartButton}
                            href={product.href}
                            onToggleFavorite={() => setFavorites(toggleFavorite(product))}
                            isFavorite
                            showDeleteIcon
                            onDelete={() => setDeleteFavoriteTarget(product)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeSection === 'addresses' && (
                  <div className="flex min-h-[420px] flex-col">
                    <div className="border-b border-[#b8956a]/45 bg-[#c4a77d] px-4 py-3 sm:px-6 sm:py-3.5">
                      <h2 className="text-lg font-semibold text-[#2c1810]">My Addresses</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4 px-4 py-5 sm:grid-cols-2 sm:px-6 sm:py-6">
                      <div>
                        <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-1">
                          Address Line 1
                        </label>
                        <input
                          id="addressLine1"
                          name="addressLine1"
                          type="text"
                          value={formData.addressLine1}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-gray-900 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-1">
                          Address Line 2
                        </label>
                        <input
                          id="addressLine2"
                          name="addressLine2"
                          type="text"
                          value={formData.addressLine2}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-gray-900 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          id="city"
                          name="city"
                          type="text"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-gray-900 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                          State
                        </label>
                        <input
                          id="state"
                          name="state"
                          type="text"
                          value={formData.state}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-gray-900 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                          Country
                        </label>
                        <input
                          id="country"
                          name="country"
                          type="text"
                          value={formData.country}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-gray-900 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                          Pincode
                        </label>
                        <input
                          id="pincode"
                          name="pincode"
                          type="text"
                          value={formData.pincode}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-gray-900 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'profile' && (
                  <div className="flex min-h-[420px] flex-col">
                    <div className="border-b border-[#b8956a]/45 bg-[#c4a77d] px-4 py-3 sm:px-6 sm:py-3.5">
                      <h2 className="text-lg font-semibold text-[#2c1810]">My Profile</h2>
                    </div>

                    {loading ? (
                      <p className="px-4 py-6 text-sm text-gray-600 sm:px-6">Loading profile...</p>
                    ) : (
                      <form onSubmit={handleSave} className="space-y-4 px-4 py-5 sm:px-6 sm:py-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                              Username
                            </label>
                            <input
                              id="name"
                              name="name"
                              type="text"
                              value={formData.name}
                              onChange={handleChange}
                              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-gray-900 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                              Email
                            </label>
                            <input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              readOnly
                              className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm text-gray-600"
                            />
                          </div>
                          <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                              Phone Number
                            </label>
                            <input
                              id="phone"
                              name="phone"
                              type="text"
                              value={formData.phone}
                              onChange={handleChange}
                              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-gray-900 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                              Gender
                            </label>
                            <select
                              id="gender"
                              name="gender"
                              value={formData.gender}
                              onChange={handleChange}
                              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-gray-900 focus:outline-none"
                            >
                              <option value="">Select gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                              <option value="prefer_not_to_say">Prefer not to say</option>
                            </select>
                          </div>
                          <div className="sm:col-span-2">
                            <label
                              htmlFor="dateOfBirth"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Date of Birth
                            </label>
                            <input
                              id="dateOfBirth"
                              name="dateOfBirth"
                              type="date"
                              value={formData.dateOfBirth}
                              onChange={handleChange}
                              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-gray-900 focus:outline-none"
                            />
                          </div>
                        </div>

                        {error && <p className="text-sm text-red-600">{error}</p>}
                        {message && <p className="text-sm text-green-700">{message}</p>}

                        <button
                          type="submit"
                          disabled={saving}
                          className="rounded-lg bg-[#c4a77d] px-6 py-2.5 text-sm font-medium text-[#2c1810] transition-colors hover:bg-[#b8956a] focus:outline-none focus:ring-2 focus:ring-[#c4a77d]/40 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {saving ? 'Saving...' : 'Save Profile'}
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
      <ConfirmPopup
        isOpen={Boolean(deleteFavoriteTarget)}
        title="Remove from favorites?"
        message={
          deleteFavoriteTarget?.productTitle
            ? `"${deleteFavoriteTarget.productTitle}" will be removed from your favorites.`
            : 'This product will be removed from your favorites.'
        }
        confirmText="Yes, remove"
        cancelText="Cancel"
        onConfirm={() => handleDeleteFavorite(deleteFavoriteTarget)}
        onCancel={() => setDeleteFavoriteTarget(null)}
      />
      <ConfirmPopup
        isOpen={showLogoutConfirm}
        title="Confirm Logout"
        message="Are you sure you want to logout from your account?"
        confirmText="Yes, Logout"
        cancelText="Cancel"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  )
}
