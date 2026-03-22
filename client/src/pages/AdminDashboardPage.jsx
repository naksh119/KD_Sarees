import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ConfirmPopup from '../components/ConfirmPopup'
import { api } from '../utils/api'

const ADMIN_SESSION_KEY = 'kd_sarees_admin_session'
const ADMIN_TOKEN_KEY = 'kd_sarees_admin_token'
const ADMIN_REFRESH_TOKEN_KEY = 'kd_sarees_admin_refresh_token'
const USER_TOKEN_KEY = 'kd_sarees_token'
const USER_REFRESH_TOKEN_KEY = 'kd_sarees_refresh_token'
const USER_PROFILE_KEY = 'kd_sarees_user'
const MAX_IMAGE_SIZE_MB = 5

const defaultProducts = []

const initialForm = {
  name: '',
  price: '',
  category: '',
  stock: '',
  imageFile: null,
  imageUrl: '',
}

const initialOfferForm = {
  title: '',
  description: '',
  code: '',
  discountPercent: '',
  startsAt: '',
  endsAt: '',
}

const initialCategoryForm = {
  name: '',
  description: '',
}

const sidebarItems = [
  { key: 'overview', label: 'Overview' },
  { key: 'offers', label: 'Offers' },
  { key: 'products', label: 'Products' },
  { key: 'reviews', label: 'Reviews' },
  { key: 'orders', label: 'Orders' },
  { key: 'allUsers', label: 'All Users' },
  { key: 'adminUsers', label: 'Admin Users' },
  { key: 'analytics', label: 'Analytics' },
]

const mockRecentOrders = []

const mockActivities = [
  'Price updated for Banarasi Silk Saree.',
  'New product image uploaded.',
  'Stock changed for Kanchipuram Wedding Saree.',
]

const DEFAULT_CATEGORY_NAMES = [
  'Clothing',
  'Gorget',
  'Pethni',
  'Banarsi',
  'Tishu',
  'Ready made blouse',
  'Handwork',
]

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '')
    reader.onerror = () => reject(new Error('Unable to process image file.'))
    reader.readAsDataURL(file)
  })

const normalizeCategoryList = (payload) => {
  const rawList = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.categories)
      ? payload.categories
      : Array.isArray(payload?.data)
        ? payload.data
        : []

  return rawList
    .map((item) => {
      const id = item?._id || item?.id || item?.slug || ''
      const name = item?.name || item?.title || ''
      return id && name ? { id: String(id), name: String(name) } : null
    })
    .filter(Boolean)
}

const toNumber = (value) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const toInputDateTimeText = (value) => {
  if (!value) return ''
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return ''
  return parsed.toISOString().slice(0, 16)
}

const formatUserDate = (value) => {
  if (!value) return '—'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return '—'
  return parsed.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}

export default function AdminDashboardPage() {
  const navigate = useNavigate()
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://kd-sarees.onrender.com'
  const [products, setProducts] = useState(defaultProducts)
  const [formData, setFormData] = useState(initialForm)
  const [categories, setCategories] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [offerSuccessMessage, setOfferSuccessMessage] = useState('')
  const [activeSection, setActiveSection] = useState('overview')
  const [offers, setOffers] = useState([])
  const [offerFormData, setOfferFormData] = useState(initialOfferForm)
  const [offerError, setOfferError] = useState('')
  const [offerLoading, setOfferLoading] = useState(false)
  const [editingOfferId, setEditingOfferId] = useState(null)
  const [reviews, setReviews] = useState([])
  const [reviewError, setReviewError] = useState('')
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState('')
  const [categoryFormData, setCategoryFormData] = useState(initialCategoryForm)
  const [categoryError, setCategoryError] = useState('')
  const [categorySuccessMessage, setCategorySuccessMessage] = useState('')
  const [previewImageUrl, setPreviewImageUrl] = useState('')
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [usersList, setUsersList] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersError, setUsersError] = useState('')
  const [usersSuccessMessage, setUsersSuccessMessage] = useState('')
  const [userPendingDelete, setUserPendingDelete] = useState(null)
  const categoryOptions = useMemo(() => normalizeCategoryList(categories), [categories])
  const selectCategoryOptions = useMemo(() => {
    const byName = new Map(categoryOptions.map((category) => [category.name.trim().toLowerCase(), category]))
    const orderedDefaults = DEFAULT_CATEGORY_NAMES.map((name) => byName.get(name.trim().toLowerCase())).filter(Boolean)
    if (orderedDefaults.length > 0) {
      return orderedDefaults
    }
    return categoryOptions
  }, [categoryOptions])
  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const productData = await api.getProducts()
        setProducts(
          (productData || []).map((p) => ({
            id: p._id,
            name: p.name,
            price: toNumber(p.price),
            category: p.category?._id || p.category || '',
            categoryName: p.category?.name || 'Uncategorized',
            stock: toNumber(p.stock),
            imageUrl: p.images?.[0] || '',
          })),
        )
        const categoryData = await api.getCategories()
        setCategories(categoryData)
        const token = localStorage.getItem(ADMIN_TOKEN_KEY)
        if (token) {
          const offersData = await api.getAdminOffers()
          setOffers(Array.isArray(offersData) ? offersData : [])
        }
        const reviewData = await api.getReviews()
        setReviews(Array.isArray(reviewData) ? reviewData : [])
      } catch (err) {
        setOfferError(err.message || 'Unable to fetch offers')
      }
    }

    loadAdminData()
  }, [apiBaseUrl])

  useEffect(() => {
    if (activeSection !== 'allUsers' && activeSection !== 'adminUsers') {
      return undefined
    }
    let cancelled = false
    const loadUsers = async () => {
      setUsersLoading(true)
      setUsersError('')
      setUsersSuccessMessage('')
      try {
        const role = activeSection === 'adminUsers' ? 'admin' : 'user'
        const data = await api.listUsers(role)
        if (!cancelled) {
          setUsersList(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        if (!cancelled) {
          setUsersError(err.message || 'Unable to load users')
        }
      } finally {
        if (!cancelled) {
          setUsersLoading(false)
        }
      }
    }
    loadUsers()
    return () => {
      cancelled = true
    }
  }, [activeSection])

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file.')
      return
    }

    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setError(`Image size must be less than ${MAX_IMAGE_SIZE_MB}MB.`)
      return
    }

    try {
      const dataUrl = await fileToDataUrl(file)
      if (!dataUrl) {
        setError('Unable to process image file.')
        return
      }
      setFormData((prev) => ({ ...prev, imageFile: file, imageUrl: dataUrl }))
      setError('')
    } catch (_err) {
      setError('Unable to process image file.')
    }
  }

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, imageFile: null, imageUrl: '' }))
    setPreviewImageUrl('')
  }

  const resetForm = () => {
    setFormData(initialForm)
    setEditingId(null)
    setError('')
  }

  const handleOfferChange = (event) => {
    const { name, value } = event.target
    setOfferFormData((prev) => ({ ...prev, [name]: value }))
  }

  const resetOfferForm = () => {
    setOfferFormData(initialOfferForm)
    setOfferError('')
    setEditingOfferId(null)
  }

  const handleCategoryChange = (event) => {
    const { name, value } = event.target
    setCategoryFormData((prev) => ({ ...prev, [name]: value }))
  }

  const resetCategoryMessages = () => {
    setCategoryError('')
    setCategorySuccessMessage('')
  }

  const handleCategorySubmit = async (event) => {
    event.preventDefault()
    resetCategoryMessages()
    if (!categoryFormData.name.trim()) {
      setCategoryError('Please select a category name.')
      return
    }

    try {
      await api.createCategory({
        name: categoryFormData.name.trim(),
        description: categoryFormData.description.trim(),
      })
      const categoryData = await api.getCategories()
      const normalized = normalizeCategoryList(categoryData)
      setCategories(categoryData)
      if (normalized.length > 0) {
        const createdCategory = normalized.find(
          (category) => category.name.toLowerCase() === categoryFormData.name.trim().toLowerCase(),
        )
        if (createdCategory) {
          setFormData((prev) => ({ ...prev, category: createdCategory.id }))
        }
      }
      setCategoryFormData(initialCategoryForm)
      setCategorySuccessMessage('Category added successfully.')
    } catch (err) {
      setCategoryError(err.message || 'Unable to add category')
    }
  }

  const handleDeleteCategory = async (id) => {
    resetCategoryMessages()
    try {
      await api.deleteCategory(id)
      const categoryData = await api.getCategories()
      setCategories(categoryData)
      if (formData.category === id) {
        setFormData((prev) => ({ ...prev, category: '' }))
      }
      setCategorySuccessMessage('Category deleted successfully.')
    } catch (err) {
      setCategoryError(err.message || 'Unable to delete category')
    }
  }

  const handleEdit = (product) => {
    setEditingId(product.id)
    setFormData({
      name: product.name,
      price: String(product.price),
      category: product.category,
      stock: String(product.stock),
      imageFile: null,
      imageUrl: product.imageUrl || '',
    })
    setError('')
  }

  const handleDelete = async (id) => {
    try {
      await api.deleteProduct(id)
      setProducts((prev) => prev.filter((item) => item.id !== id))
      if (editingId === id) {
        resetForm()
      }
    } catch (err) {
      setError(err.message || 'Unable to delete product')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccessMessage('')

    if (!formData.name || !formData.price || !formData.category || !formData.stock) {
      setError('Please fill all product fields.')
      return
    }

    const payload = {
      name: formData.name.trim(),
      price: Number(formData.price),
      category: formData.category.trim(),
      stock: Number(formData.stock),
      images: formData.imageUrl ? [formData.imageUrl] : [],
    }

    if (Number.isNaN(payload.price) || Number.isNaN(payload.stock)) {
      setError('Price and stock must be valid numbers.')
      return
    }

    try {
      if (editingId !== null) {
        await api.updateProduct(editingId, payload)
        setSuccessMessage('Product updated successfully.')
      } else {
        await api.createProduct(payload)
        setSuccessMessage('Product added successfully.')
      }
      const productData = await api.getProducts()
      setProducts(
        (productData || []).map((p) => ({
          id: p._id,
          name: p.name,
          price: toNumber(p.price),
          category: p.category?._id || p.category || '',
          categoryName: p.category?.name || 'Uncategorized',
          stock: toNumber(p.stock),
          imageUrl: p.images?.[0] || '',
        })),
      )
      resetForm()
    } catch (err) {
      setError(err.message || 'Unable to save product')
    }
  }

  const handleOfferSubmit = async (event) => {
    event.preventDefault()
    setOfferError('')
    setOfferSuccessMessage('')

    if (!offerFormData.title || !offerFormData.description || !offerFormData.startsAt || !offerFormData.endsAt) {
      setOfferError('Please fill title, description, start date and end date.')
      return
    }

    const token = localStorage.getItem(ADMIN_TOKEN_KEY)
    if (!token) {
      setOfferError('Admin token missing. Please login again.')
      return
    }

    try {
      setOfferLoading(true)
      const payload = {
        title: offerFormData.title.trim(),
        description: offerFormData.description.trim(),
        code: offerFormData.code.trim(),
        discountPercent: offerFormData.discountPercent ? Number(offerFormData.discountPercent) : undefined,
        startsAt: offerFormData.startsAt.trim(),
        endsAt: offerFormData.endsAt.trim(),
      }

      if (editingOfferId) {
        const data = await api.updateOffer(editingOfferId, payload)
        setOffers((prev) => prev.map((item) => (item._id === data._id ? data : item)))
        setOfferSuccessMessage('Offer updated successfully.')
      } else {
        const data = await api.createOffer(payload)
        setOffers((prev) => [data, ...prev])
        setOfferSuccessMessage('Offer created successfully.')
      }
      resetOfferForm()
    } catch (err) {
      setOfferError(err.message || 'Unable to create offer')
    } finally {
      setOfferLoading(false)
    }
  }

  const toggleOfferStatus = async (offer) => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY)
    if (!token) {
      setOfferError('Admin token missing. Please login again.')
      return
    }

    try {
      const data = await api.updateOffer(offer._id, { isActive: !offer.isActive })
      setOffers((prev) => prev.map((item) => (item._id === data._id ? data : item)))
    } catch (err) {
      setOfferError(err.message || 'Unable to update offer')
    }
  }

  const deleteOffer = async (id) => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY)
    if (!token) {
      setOfferError('Admin token missing. Please login again.')
      return
    }

    try {
      await api.deleteOffer(id)
      setOffers((prev) => prev.filter((item) => item._id !== id))
    } catch (err) {
      setOfferError(err.message || 'Unable to delete offer')
    }
  }

  const editOffer = (offer) => {
    setOfferError('')
    setOfferSuccessMessage('')
    setEditingOfferId(offer._id)
    setOfferFormData({
      title: offer.title || '',
      description: offer.description || '',
      code: offer.code || '',
      discountPercent: offer.discountPercent ? String(offer.discountPercent) : '',
      startsAt: toInputDateTimeText(offer.startsAt),
      endsAt: toInputDateTimeText(offer.endsAt),
    })
  }

  const handleDeleteReview = async (id) => {
    setReviewError('')
    setReviewSuccessMessage('')
    const shouldDelete = window.confirm('Delete this review? This action cannot be undone.')
    if (!shouldDelete) {
      return
    }

    try {
      await api.deleteReview(id)
      setReviews((prev) => prev.filter((review) => review._id !== id))
      setReviewSuccessMessage('Review deleted successfully.')
    } catch (err) {
      setReviewError(err.message || 'Unable to delete review')
    }
  }

  const confirmDeleteUser = async () => {
    const user = userPendingDelete
    if (!user) return
    setUserPendingDelete(null)
    setUsersError('')
    setUsersSuccessMessage('')
    try {
      await api.deleteUser(user._id)
      setUsersSuccessMessage('User deleted.')
      const role = activeSection === 'adminUsers' ? 'admin' : 'user'
      const data = await api.listUsers(role)
      setUsersList(Array.isArray(data) ? data : [])
    } catch (err) {
      setUsersError(err.message || 'Unable to delete user')
    }
  }

  const userDeleteLabel = userPendingDelete?.name || userPendingDelete?.email || 'this user'

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY)
    localStorage.removeItem(ADMIN_TOKEN_KEY)
    localStorage.removeItem(ADMIN_REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_TOKEN_KEY)
    localStorage.removeItem(USER_REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_PROFILE_KEY)
    navigate('/admin/login', { replace: true })
  }

  const stats = useMemo(() => {
    const totalProducts = products.length
    // Keep overview numbers product-based to match admin expectations.
    const totalStock = totalProducts
    const totalValue = products.reduce((sum, product) => sum + product.price, 0)
    const lowStockCount = products.filter((product) => product.stock < 10).length
    return { totalProducts, totalStock, totalValue, lowStockCount }
  }, [products])

  const analyticsData = useMemo(() => {
    const categoryMap = products.reduce((acc, product) => {
      const key = product.categoryName || 'Uncategorized'
      acc.set(key, (acc.get(key) || 0) + 1)
      return acc
    }, new Map())

    const categoryDistribution = Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)

    const stockStatus = [
      {
        label: 'Low (<10)',
        value: products.filter((product) => product.stock < 10).length,
        color: '#dc2626',
      },
      {
        label: 'Medium (10-29)',
        value: products.filter((product) => product.stock >= 10 && product.stock < 30).length,
        color: '#f59e0b',
      },
      {
        label: 'Healthy (30+)',
        value: products.filter((product) => product.stock >= 30).length,
        color: '#16a34a',
      },
    ]

    const priceBuckets = [
      { label: 'Below 1000', min: 0, max: 999 },
      { label: '1000-2499', min: 1000, max: 2499 },
      { label: '2500-4999', min: 2500, max: 4999 },
      { label: '5000+', min: 5000, max: Number.POSITIVE_INFINITY },
    ]

    const priceRanges = priceBuckets.map((bucket) => ({
      label: bucket.label,
      count: products.filter((product) => product.price >= bucket.min && product.price <= bucket.max).length,
    }))

    const categoryMax = Math.max(...categoryDistribution.map((entry) => entry.count), 1)
    const priceRangeMax = Math.max(...priceRanges.map((entry) => entry.count), 1)

    // Synthetic 7-day trend snapshot based on current catalog mix.
    const trendPoints = Array.from({ length: 7 }, (_, index) => {
      const day = `D${index + 1}`
      const wave = Math.sin((index + 1) * 0.9)
      const uplift = Math.max(0, Math.round((stats.totalProducts / 10) * wave))
      const value = Math.max(0, stats.totalProducts - 3 + index + uplift)
      return { day, value }
    })
    const trendMax = Math.max(...trendPoints.map((point) => point.value), 1)

    return { categoryDistribution, stockStatus, priceRanges, categoryMax, priceRangeMax, trendPoints, trendMax }
  }, [products])

  const onSidebarClick = (key) => {
    setActiveSection(key)
    setIsMobileSidebarOpen(false)
  }

  const openImagePreview = () => {
    if (!formData.imageUrl) {
      return
    }
    setPreviewImageUrl(formData.imageUrl)
  }

  const closeImagePreview = () => {
    setPreviewImageUrl('')
  }

  return (
    <main className="min-h-screen bg-[#f6f7fb]">
      <div className="flex">
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 bg-black/40"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <aside className="relative z-[101] w-72 max-w-[85vw] min-h-screen bg-[#0f172a] text-white flex flex-col shadow-xl">
              <div className="px-6 py-6 border-b border-white/15 flex items-center justify-between gap-3">
                <div>
                  <Link
                    to="/"
                    className="inline-block text-3xl text-[#f5d76e] transition hover:text-[#ffe08a]"
                    style={{ fontFamily: "'Great Vibes', cursive" }}
                  >
                    Kd Sarees
                  </Link>
                  <p className="text-xl mt-1 text-slate-200" style={{ fontFamily: "'Great Vibes', cursive" }}>
                    Admin Panel
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Close sidebar"
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="rounded-md border border-[#c4a77d] bg-[#c4a77d] px-2.5 py-1 text-sm font-medium text-[#2c1810] transition hover:bg-[#b8956a]"
                >
                  X
                </button>
              </div>
              <nav className="px-4 py-5 space-y-1">
                {sidebarItems.map((item) => {
                  const isActive = activeSection === item.key
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => onSidebarClick(item.key)}
                      className={`w-full text-left rounded-lg px-3 py-2.5 text-sm transition ${
                        isActive
                          ? 'bg-[#c4a77d] text-[#2c1810] font-semibold'
                          : 'text-slate-100 hover:bg-[#c4a77d]/25 hover:text-[#f3e8d7]'
                      }`}
                    >
                      {item.label}
                    </button>
                  )
                })}
              </nav>
              <div className="mt-auto p-4 border-t border-white/15">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-lg border border-[#c4a77d] bg-[#c4a77d] px-4 py-2 text-sm font-medium text-[#2c1810] transition hover:bg-[#b8956a]"
                >
                  Logout
                </button>
              </div>
            </aside>
          </div>
        )}

        <aside className="hidden lg:flex lg:w-64 lg:min-h-screen lg:fixed lg:left-0 lg:top-0 bg-[#0f172a] text-white flex-col">
          <div className="px-6 py-6 border-b border-white/15">
            <Link
              to="/"
              className="inline-block text-3xl text-[#f5d76e] transition hover:text-[#ffe08a]"
              style={{ fontFamily: "'Great Vibes', cursive" }}
            >
              Kd Sarees
            </Link>
          </div>
          <nav className="px-4 py-5 space-y-1">
            {sidebarItems.map((item) => {
              const isActive = activeSection === item.key
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => onSidebarClick(item.key)}
                  className={`w-full text-left rounded-lg px-3 py-2.5 text-sm transition ${
                    isActive
                    ? 'bg-[#c4a77d] text-[#2c1810] font-semibold'
                    : 'text-slate-100 hover:bg-[#c4a77d]/25 hover:text-[#f3e8d7]'
                  }`}
                >
                  {item.label}
                </button>
              )
            })}
          </nav>
          <div className="mt-auto p-4 border-t border-white/15">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-lg border border-[#c4a77d] bg-[#c4a77d] px-4 py-2 text-sm font-medium text-[#2c1810] transition hover:bg-[#b8956a]"
            >
              Logout
            </button>
          </div>
        </aside>

        <section className="w-full lg:ml-64 px-4 py-6 sm:px-6 lg:px-8 space-y-6">
          <div className="lg:hidden flex items-center justify-between rounded-xl bg-white border border-slate-200 px-4 py-3 shadow-sm">
            <Link
              to="/"
              className="text-2xl text-slate-900 transition hover:text-[#191970]"
              style={{ fontFamily: "'Great Vibes', cursive" }}
            >
              Kd Sarees
            </Link>
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#c4a77d] text-[#2c1810] transition hover:bg-[#b8956a]"
            >
              <span className="text-lg leading-none">☰</span>
            </button>
          </div>

          <header className="rounded-2xl p-5 sm:p-6 bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Dashboard</p>
              <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-1">Admin Control Center</h1>
              <p className="text-sm text-slate-600 mt-2">
                Professional workspace for catalog, orders, customers, and store monitoring.
              </p>
            </div>
            <span className="text-xs rounded-full bg-emerald-100 text-emerald-700 px-2.5 py-1">Admin Active</span>
          </header>

          {activeSection === 'offers' && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#191970]">Offer Control</p>
                <h2 className="text-xl sm:text-2xl font-semibold mt-1 text-slate-900">Add Offer</h2>
                <p className="text-sm text-slate-600 mt-1">
                  New offers are saved in backend and automatically shown in top UI ticker.
                </p>
              </div>
            </div>

            <form className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3" onSubmit={handleOfferSubmit}>
              <input
                name="title"
                type="text"
                placeholder="Offer title"
                value={offerFormData.title}
                onChange={handleOfferChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus:border-[#191970] focus:outline-none"
              />
              <input
                name="description"
                type="text"
                placeholder="Offer description"
                value={offerFormData.description}
                onChange={handleOfferChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus:border-[#191970] focus:outline-none"
              />
              <input
                name="code"
                type="text"
                placeholder="Coupon code (optional)"
                value={offerFormData.code}
                onChange={handleOfferChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus:border-[#191970] focus:outline-none"
              />
              <input
                name="discountPercent"
                type="number"
                min="0"
                max="100"
                placeholder="Discount %"
                value={offerFormData.discountPercent}
                onChange={handleOfferChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus:border-[#191970] focus:outline-none"
              />
              <input
                name="startsAt"
                type="datetime-local"
                placeholder="Start date and time"
                value={offerFormData.startsAt}
                onChange={handleOfferChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-[#191970] focus:outline-none"
              />
              <input
                name="endsAt"
                type="datetime-local"
                placeholder="End date and time"
                value={offerFormData.endsAt}
                onChange={handleOfferChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-[#191970] focus:outline-none"
              />
              <button
                type="submit"
                disabled={offerLoading}
                className="md:col-span-3 rounded-lg bg-[#c4a77d] py-2.5 text-sm font-semibold text-[#2c1810] transition hover:bg-[#b8956a] disabled:opacity-70"
              >
                {offerLoading ? 'Saving offer...' : editingOfferId ? 'Update Offer' : 'Publish Offer'}
              </button>
              {editingOfferId && (
                <button
                  type="button"
                  onClick={resetOfferForm}
                  className="md:col-span-3 rounded-lg border border-[#c4a77d] bg-white px-3 py-2.5 text-sm font-medium text-[#2c1810] transition hover:bg-[#c4a77d]/15"
                >
                  Cancel Edit
                </button>
              )}
            </form>
            {offerError && <p className="text-sm text-red-600 mt-3">{offerError}</p>}
            {offerSuccessMessage && <p className="text-sm text-emerald-700 mt-3">{offerSuccessMessage}</p>}
            </section>
          )}

          {(activeSection === 'overview' || activeSection === 'products') && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wider text-gray-500">Total Products</p>
                <p className="text-2xl font-semibold text-[#191970] mt-2">{stats.totalProducts}</p>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wider text-gray-500">Total Items</p>
                <p className="text-2xl font-semibold text-[#191970] mt-2">{stats.totalStock}</p>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wider text-gray-500">Products Value</p>
                <p className="text-2xl font-semibold text-[#191970] mt-2">
                  Rs. {stats.totalValue.toLocaleString('en-IN')}
                </p>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wider text-gray-500">Low Stock Items</p>
                <p className="text-2xl font-semibold text-amber-700 mt-2">{stats.lowStockCount}</p>
              </article>
            </div>
          )}

          {activeSection === 'offers' && (
            <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Current Offers</h3>
            {offers.length === 0 ? (
              <p className="text-sm text-slate-600">No offers created yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {offers.map((offer) => (
                  <article key={offer._id} className="rounded-lg border border-slate-200 p-3">
                    <p className="text-sm font-semibold text-slate-900">{offer.title}</p>
                    <p className="text-xs text-slate-600 mt-1">{offer.description}</p>
                    <p className="text-xs text-slate-500 mt-2">
                      {offer.discountPercent ? `${offer.discountPercent}% OFF` : 'General offer'}
                      {offer.code ? ` | Code: ${offer.code}` : ''}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Start: {offer.startsAt ? new Date(offer.startsAt).toLocaleString() : '-'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      End: {offer.endsAt ? new Date(offer.endsAt).toLocaleString() : '-'}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => editOffer(offer)}
                        className="flex-1 rounded-md border border-[#c4a77d] px-2.5 py-1.5 text-xs font-medium text-[#2c1810] hover:bg-[#c4a77d]/15"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleOfferStatus(offer)}
                        className={`flex-1 rounded-md px-2.5 py-1.5 text-xs font-medium border ${
                          offer.isActive
                            ? 'border-[#c4a77d] bg-[#c4a77d]/20 text-[#2c1810] hover:bg-[#c4a77d]/30'
                            : 'border-[#c4a77d] text-[#2c1810] hover:bg-[#c4a77d]/15'
                        }`}
                      >
                        {offer.isActive ? 'Active' : 'Inactive'}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteOffer(offer._id)}
                        className="flex-1 rounded-md border border-[#c4a77d] px-2.5 py-1.5 text-xs font-medium text-[#2c1810] hover:bg-[#c4a77d]/15"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
            </section>
          )}

          {activeSection === 'reviews' && (
            <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
              <div className="mb-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#191970]">Review Moderation</p>
                <h3 className="text-lg font-semibold text-slate-900 mt-1">Customer Reviews</h3>
                <p className="text-sm text-slate-600 mt-1">Delete inappropriate or unwanted reviews.</p>
              </div>
              {reviewError && <p className="text-sm text-red-600 mb-3">{reviewError}</p>}
              {reviewSuccessMessage && <p className="text-sm text-emerald-700 mb-3">{reviewSuccessMessage}</p>}
              {reviews.length === 0 ? (
                <p className="text-sm text-slate-600">No reviews available.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {reviews.map((review) => (
                    <article key={review._id} className="rounded-lg border border-slate-200 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900">{review.user?.name || 'Customer'}</p>
                        <span className="text-xs text-amber-700 bg-amber-100 rounded-full px-2 py-1">
                          {review.rating}/5
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{review.product?.name || 'Product review'}</p>
                      <p className="text-sm text-slate-700 mt-2">{review.comment}</p>
                      <button
                        type="button"
                        onClick={() => handleDeleteReview(review._id)}
                        className="mt-3 w-full rounded-md border border-[#c4a77d] px-2.5 py-1.5 text-xs font-medium text-[#2c1810] transition hover:bg-[#c4a77d]/15"
                      >
                        Delete Review
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {(activeSection === 'allUsers' || activeSection === 'adminUsers') && (
            <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
              <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#191970]">User management</p>
                  <h3 className="text-lg font-semibold text-slate-900 mt-1">
                    {activeSection === 'adminUsers' ? 'Admin accounts' : 'All customers'}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    {activeSection === 'adminUsers'
                      ? 'Accounts with admin access to this panel.'
                      : 'Registered customers only (admin accounts are listed under Admin Users). Delete removes the account and related data from the database.'}
                  </p>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-2 min-h-[1rem]">
                  {usersLoading ? (
                    <>
                      <span
                        className="inline-block h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-slate-200 border-t-[#c4a77d]"
                        aria-hidden
                      />
                      <span>Loading…</span>
                    </>
                  ) : (
                    `${usersList.length} user${usersList.length === 1 ? '' : 's'}`
                  )}
                </p>
              </div>
              {usersError && <p className="text-sm text-red-600 mb-3">{usersError}</p>}
              {usersSuccessMessage && <p className="text-sm text-emerald-700 mb-3">{usersSuccessMessage}</p>}
              {usersLoading ? (
                <div
                  className="flex flex-col items-center justify-center gap-3 py-16"
                  role="status"
                  aria-live="polite"
                  aria-label="Loading users"
                >
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-[#c4a77d] border-r-[#c4a77d]/40" />
                  <p className="text-sm text-slate-500">Loading users…</p>
                </div>
              ) : usersList.length === 0 ? (
                <p className="text-sm text-slate-600">No users found.</p>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
                      <tr>
                        <th className="px-3 py-2.5 font-semibold">Name</th>
                        <th className="px-3 py-2.5 font-semibold">Email</th>
                        <th className="px-3 py-2.5 font-semibold">Phone</th>
                        <th className="px-3 py-2.5 font-semibold">Role</th>
                        <th className="px-3 py-2.5 font-semibold">Verified</th>
                        <th className="px-3 py-2.5 font-semibold">Joined</th>
                        <th className="px-3 py-2.5 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {usersList.map((u) => (
                        <tr key={u._id} className="text-slate-800">
                          <td className="px-3 py-2.5 font-medium">{u.name || '—'}</td>
                          <td className="px-3 py-2.5">{u.email || '—'}</td>
                          <td className="px-3 py-2.5">{u.phone || '—'}</td>
                          <td className="px-3 py-2.5">
                            <span
                              className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                u.role === 'admin'
                                  ? 'bg-indigo-100 text-indigo-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {u.role === 'admin' ? 'Admin' : 'User'}
                            </span>
                          </td>
                          <td className="px-3 py-2.5">
                            <span
                              className={`inline-flex items-center justify-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
                                u.isEmailVerified
                                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                                  : 'border-red-200 bg-red-50 text-red-700'
                              }`}
                            >
                              {u.isEmailVerified ? 'Yes' : 'No'}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">
                            {formatUserDate(u.createdAt)}
                          </td>
                          <td className="px-3 py-2.5 text-right">
                            <button
                              type="button"
                              onClick={() => setUserPendingDelete(u)}
                              className="rounded-md border border-red-200 bg-white px-2.5 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {activeSection === 'analytics' && (
            <section className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#312e81] p-5 sm:p-6 shadow-sm text-white">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-indigo-200">Store Analytics</p>
                  <h2 className="text-xl sm:text-2xl font-semibold mt-1">Modern Visual Insights</h2>
                  <p className="text-sm text-indigo-100/90 mt-1">
                    Different graph types for category mix, stock health, price buckets, and trend tracking.
                  </p>
                </div>
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-white/20 bg-white/10 p-3">
                    <p className="text-xs text-indigo-100">Catalog Size</p>
                    <p className="text-2xl font-semibold mt-1">{stats.totalProducts}</p>
                  </div>
                  <div className="rounded-xl border border-white/20 bg-white/10 p-3">
                    <p className="text-xs text-indigo-100">Low Stock Risk</p>
                    <p className="text-2xl font-semibold mt-1">{stats.lowStockCount}</p>
                  </div>
                  <div className="rounded-xl border border-white/20 bg-white/10 p-3">
                    <p className="text-xs text-indigo-100">Catalog Value</p>
                    <p className="text-2xl font-semibold mt-1">Rs. {stats.totalValue.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <article className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
                  <h3 className="text-base font-semibold text-slate-900">Horizontal Bar: Products by Category</h3>
                  {analyticsData.categoryDistribution.length === 0 ? (
                    <p className="text-sm text-slate-600 mt-3">No products available to generate graph.</p>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {analyticsData.categoryDistribution.map((item) => {
                        const width = Math.max((item.count / analyticsData.categoryMax) * 100, 6)
                        return (
                          <div key={item.name}>
                            <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                              <span>{item.name}</span>
                              <span>{item.count}</span>
                            </div>
                            <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-500"
                                style={{ width: `${width}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </article>

                <article className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
                  <h3 className="text-base font-semibold text-slate-900">Donut: Inventory Health</h3>
                  {stats.totalProducts === 0 ? (
                    <p className="text-sm text-slate-600 mt-3">Add products to view stock health graph.</p>
                  ) : (
                    <div className="mt-4 flex flex-col sm:flex-row gap-5 sm:items-center">
                      <div className="relative w-40 h-40 shrink-0">
                        {(() => {
                          const total = analyticsData.stockStatus.reduce((sum, item) => sum + item.value, 0) || 1
                          let cumulative = 0
                          const radius = 56
                          const circumference = 2 * Math.PI * radius

                          return (
                            <svg viewBox="0 0 140 140" className="w-full h-full">
                              <circle cx="70" cy="70" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="18" />
                              {analyticsData.stockStatus.map((item) => {
                                const segmentLength = (item.value / total) * circumference
                                const dashArray = `${segmentLength} ${circumference - segmentLength}`
                                const dashOffset = -cumulative
                                cumulative += segmentLength
                                return (
                                  <circle
                                    key={item.label}
                                    cx="70"
                                    cy="70"
                                    r={radius}
                                    fill="none"
                                    stroke={item.color}
                                    strokeWidth="18"
                                    strokeDasharray={dashArray}
                                    strokeDashoffset={dashOffset}
                                    strokeLinecap="butt"
                                    transform="rotate(-90 70 70)"
                                  />
                                )
                              })}
                            </svg>
                          )
                        })()}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-[11px] uppercase tracking-wider text-slate-500">Products</p>
                            <p className="text-xl font-semibold text-slate-900">{stats.totalProducts}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        {analyticsData.stockStatus.map((item) => (
                          <div key={item.label} className="flex items-center gap-2 text-sm text-slate-700">
                            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                            <span>{item.label}</span>
                            <span className="ml-auto font-medium text-slate-900">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <article className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
                  <h3 className="text-base font-semibold text-slate-900">Column Bars: Price Range Distribution</h3>
                  {analyticsData.priceRanges.every((item) => item.count === 0) ? (
                    <p className="text-sm text-slate-600 mt-3">No product prices available for distribution graph.</p>
                  ) : (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                      {analyticsData.priceRanges.map((item) => {
                        const barHeight = Math.max((item.count / analyticsData.priceRangeMax) * 100, item.count > 0 ? 12 : 0)
                        return (
                          <div key={item.label} className="rounded-lg border border-slate-200 p-3">
                            <p className="text-xs text-slate-600">{item.label}</p>
                            <div className="mt-3 h-28 bg-slate-50 rounded-md flex items-end p-2">
                              <div className="w-full rounded-sm bg-[#c4a77d]" style={{ height: `${barHeight}%` }} />
                            </div>
                            <p className="mt-2 text-sm font-semibold text-slate-900">{item.count} products</p>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </article>

                <article className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
                  <h3 className="text-base font-semibold text-slate-900">Area Trend: 7 Day Catalog Signal</h3>
                  {stats.totalProducts === 0 ? (
                    <p className="text-sm text-slate-600 mt-3">Add products to view trend graph.</p>
                  ) : (
                    <div className="mt-4">
                      <div className="h-40 rounded-xl bg-slate-50 p-3">
                        {(() => {
                          const pointsCount = analyticsData.trendPoints.length
                          const points = analyticsData.trendPoints
                            .map((point, index) => {
                              const x = (index / Math.max(pointsCount - 1, 1)) * 100
                              const y = 100 - (point.value / analyticsData.trendMax) * 88
                              return `${x},${y}`
                            })
                            .join(' ')
                          const areaPoints = `0,100 ${points} 100,100`

                          return (
                            <svg viewBox="0 0 100 100" className="w-full h-full">
                              <defs>
                                <linearGradient id="trendArea" x1="0" x2="0" y1="0" y2="1">
                                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.45" />
                                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.05" />
                                </linearGradient>
                              </defs>
                              <polyline fill="url(#trendArea)" stroke="none" points={areaPoints} />
                              <polyline fill="none" stroke="#4f46e5" strokeWidth="2.2" points={points} />
                            </svg>
                          )
                        })()}
                      </div>
                      <div className="mt-3 grid grid-cols-7 gap-2">
                        {analyticsData.trendPoints.map((point) => (
                          <div key={point.day} className="text-center">
                            <p className="text-[11px] text-slate-500">{point.day}</p>
                            <p className="text-xs font-semibold text-slate-900">{point.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              </div>

              <article className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
                <h3 className="text-base font-semibold text-slate-900">Stacked Progress: Category Contribution</h3>
                {analyticsData.categoryDistribution.length === 0 ? (
                  <p className="text-sm text-slate-600 mt-3">No categories to build contribution chart.</p>
                ) : (
                  <div className="mt-4">
                    <div className="h-4 w-full rounded-full overflow-hidden bg-slate-100 flex">
                      {analyticsData.categoryDistribution.map((item, index) => {
                        const width = (item.count / Math.max(stats.totalProducts, 1)) * 100
                        const palette = ['#4f46e5', '#8b5cf6', '#06b6d4', '#16a34a', '#f59e0b', '#ef4444']
                        return (
                          <div
                            key={item.name}
                            className="h-full"
                            style={{ width: `${Math.max(width, 4)}%`, backgroundColor: palette[index % palette.length] }}
                            title={`${item.name}: ${item.count}`}
                          />
                        )
                      })}
                    </div>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                      {analyticsData.categoryDistribution.map((item, index) => {
                        const palette = ['#4f46e5', '#8b5cf6', '#06b6d4', '#16a34a', '#f59e0b', '#ef4444']
                        const percent = ((item.count / Math.max(stats.totalProducts, 1)) * 100).toFixed(1)
                        return (
                          <div key={item.name} className="flex items-center gap-2 text-sm text-slate-700">
                            <span
                              className="inline-block h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: palette[index % palette.length] }}
                            />
                            <span>{item.name}</span>
                            <span className="ml-auto font-medium text-slate-900">
                              {item.count} ({percent}%)
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </article>
            </section>
          )}

          {(activeSection === 'overview' || activeSection === 'products') && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <section className="xl:col-span-2 space-y-6">
              {(activeSection === 'overview' || activeSection === 'products') && (
                <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
                  <p className="text-sm text-slate-600 mt-1">Create categories before adding products.</p>
                </div>
                <form className="space-y-3 mb-4" onSubmit={handleCategorySubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <select
                      name="name"
                      value={categoryFormData.name}
                      onChange={handleCategoryChange}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-base sm:py-2.5 sm:text-sm focus:border-[#191970] focus:outline-none"
                    >
                      <option value="">Select category</option>
                      {DEFAULT_CATEGORY_NAMES.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                    <input
                      name="description"
                      type="text"
                      placeholder="Category description (optional)"
                      value={categoryFormData.description}
                      onChange={handleCategoryChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#191970] focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-lg bg-[#c4a77d] px-4 py-2.5 text-sm font-medium text-[#2c1810] transition hover:bg-[#b8956a]"
                  >
                    Add Category
                  </button>
                </form>
                {categoryError && <p className="text-sm text-red-600 mb-3">{categoryError}</p>}
                {categorySuccessMessage && <p className="text-sm text-emerald-700 mb-3">{categorySuccessMessage}</p>}
                </div>
              )}

              {(activeSection === 'overview' || activeSection === 'products') && (
                <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {editingId ? 'Update Product' : 'Add New Product'}
                  </h2>
                  <span className="text-xs text-slate-500">Catalog Access</span>
                </div>

                <form className="space-y-3" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      name="name"
                      type="text"
                      placeholder="Product name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#191970] focus:outline-none"
                    />
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-base sm:py-2.5 sm:text-sm focus:border-[#191970] focus:outline-none"
                    >
                      <option value="">Select Category</option>
                      {selectCategoryOptions.length === 0 && (
                        <option value="" disabled>
                          No categories available. Add one first.
                        </option>
                      )}
                      {selectCategoryOptions.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <input
                      name="price"
                      type="number"
                      placeholder="Price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#191970] focus:outline-none"
                    />
                    <input
                      name="stock"
                      type="number"
                      placeholder="Stock quantity"
                      value={formData.stock}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#191970] focus:outline-none"
                    />
                  </div>

                  <div className="rounded-lg border border-dashed border-[#c4a77d] bg-amber-50 p-3">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <label htmlFor="product-image" className="text-xs font-medium text-[#2c1810]">
                        Upload Product Image
                      </label>
                      {formData.imageUrl && (
                        <button
                          type="button"
                          onClick={openImagePreview}
                          className="inline-flex rounded-md bg-[#c4a77d] px-3 py-1.5 text-xs font-medium text-[#2c1810] transition hover:bg-[#b8956a]"
                        >
                          View Image
                        </button>
                      )}
                    </div>
                    <input
                      id="product-image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full text-xs text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-[#c4a77d]/30 file:px-3 file:py-2 file:text-xs file:font-medium file:text-[#2c1810] hover:file:bg-[#c4a77d]/45"
                    />
                    {formData.imageUrl && (
                      <div className="mt-2">
                        <button
                          type="button"
                          onClick={removeImage}
                          className="text-xs font-medium text-[#2c1810] underline decoration-[#c4a77d] underline-offset-2 hover:text-[#6f4b2f]"
                        >
                          Remove image
                        </button>
                      </div>
                    )}
                    <p className="text-[11px] text-gray-500 mt-2">Max file size: {MAX_IMAGE_SIZE_MB}MB</p>
                  </div>

                  {error && <p className="text-sm text-red-600">{error}</p>}
                  {successMessage && <p className="text-sm text-emerald-700">{successMessage}</p>}

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 rounded-lg bg-[#c4a77d] py-2.5 text-sm font-medium text-[#2c1810] transition hover:bg-[#b8956a]"
                    >
                      {editingId ? 'Save Changes' : 'Add Product'}
                    </button>
                    {editingId && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="rounded-lg border border-[#c4a77d] bg-white px-3 py-2.5 text-sm font-medium text-[#2c1810] transition hover:bg-[#c4a77d]/15"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
              )}

              {(activeSection === 'overview' || activeSection === 'products') && (
              <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Products</h2>

                {products.length === 0 ? (
                  <p className="text-sm text-gray-600">No products added yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {products.map((product) => (
                      <article
                        key={product.id}
                        className="rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-md transition"
                      >
                        <img
                          src={
                            product.imageUrl ||
                            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80'
                          }
                          alt={product.name}
                          className="w-full h-36 object-cover"
                        />
                        <div className="p-3 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-medium text-gray-900 text-sm">{product.name}</h3>
                            <span className="text-xs px-2 py-1 rounded-full bg-[#191970]/10 text-[#191970]">
                              {product.categoryName || product.category}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">Rs. {product.price.toLocaleString('en-IN')}</p>
                          <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                          <div className="flex gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => handleEdit(product)}
                              className="flex-1 rounded-md border border-[#c4a77d] px-2.5 py-1.5 text-xs font-medium text-[#2c1810] transition hover:bg-[#c4a77d]/15"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(product.id)}
                              className="flex-1 rounded-md border border-[#c4a77d] px-2.5 py-1.5 text-xs font-medium text-[#2c1810] transition hover:bg-[#c4a77d]/15"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
              )}
            </section>

            {(activeSection === 'overview' || activeSection === 'products') && (
            <section className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <h3 className="text-base font-semibold text-slate-900 mb-3">Recent Orders</h3>
                <div className="space-y-3">
                  {mockRecentOrders.map((order) => (
                    <div key={order.id} className="rounded-lg border border-slate-200 p-3">
                      <p className="text-xs text-slate-500">{order.id}</p>
                      <p className="text-sm font-medium text-slate-900 mt-0.5">{order.customer}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm text-slate-700">Rs. {order.amount.toLocaleString('en-IN')}</p>
                        <span className="text-[11px] rounded-full bg-slate-100 text-slate-700 px-2 py-1">
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <h3 className="text-base font-semibold text-slate-900 mb-3">Admin Rights</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li>- Add and edit products</li>
                  <li>- Upload and update product images</li>
                  <li>- Monitor inventory and low stock</li>
                  <li>- View latest customer orders</li>
                  <li>- Track store activity and updates</li>
                </ul>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <h3 className="text-base font-semibold text-slate-900 mb-3">Recent Activity</h3>
                <div className="space-y-2">
                  {mockActivities.map((activity) => (
                    <p key={activity} className="text-sm text-slate-700 rounded-md bg-slate-50 p-2">
                      {activity}
                    </p>
                  ))}
                </div>
              </div>
            </section>
            )}
            </div>
          )}

          {!['overview', 'products', 'offers', 'reviews', 'analytics', 'allUsers', 'adminUsers'].includes(
            activeSection,
          ) && (
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 capitalize">{activeSection}</h2>
              <p className="text-sm text-slate-600 mt-2">
                This section UI is coming soon. Use the Offers tab to add offers and Products tab to manage catalog.
              </p>
            </section>
          )}

          {previewImageUrl && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
              <button
                type="button"
                aria-label="Close image preview"
                className="absolute inset-0 bg-black/60"
                onClick={closeImagePreview}
              />
              <div className="relative z-[111] w-full max-w-3xl rounded-xl bg-white p-3 sm:p-4 shadow-2xl">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-slate-900">Image Preview</p>
                  <button
                    type="button"
                    onClick={closeImagePreview}
                    className="rounded-md border border-[#c4a77d] bg-white px-2.5 py-1 text-xs font-medium text-[#2c1810] hover:bg-[#c4a77d]/15"
                  >
                    Close
                  </button>
                </div>
                <img src={previewImageUrl} alt="Product preview enlarged" className="w-full max-h-[75vh] object-contain rounded-md" />
              </div>
            </div>
          )}
        </section>
      </div>
      <ConfirmPopup
        isOpen={Boolean(userPendingDelete)}
        title={`Delete ${userDeleteLabel}?`}
        message="Their cart, favorites, reviews, orders, and payments will be removed. This cannot be undone."
        confirmText="Delete user"
        cancelText="Cancel"
        onConfirm={confirmDeleteUser}
        onCancel={() => setUserPendingDelete(null)}
      />
    </main>
  )
}
