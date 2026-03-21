import './App.css'
import { useEffect, useMemo, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import GudiPadwaHero from './components/GudiPadwaHero'
import FeaturesStrip from './components/FeaturesStrip'
import TopCategories from './components/TopCategories'
import SareeStoreSection from './components/SareeStoreSection'
import SilkSareeSection from './components/SilkSareeSection'
import ProductSection from './components/ProductSection'
import BestsellerSareesSection from './components/BestsellerSareesSection'
import StoryLookbookSection from './components/StoryLookbookSection'
import CustomerReviewsSection from './components/CustomerReviewsSection'
import Footer from './components/footer/Footer'
import AdminRoute from './components/AdminRoute'
import OfferTicker from './components/OfferTicker'
import AuthEntryPage from './pages/AuthEntryPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import UserInfoPage from './pages/UserInfoPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import CartPage from './pages/CartPage'
import { api } from './utils/api'

const isUserLoggedIn = () =>
  Boolean(localStorage.getItem('kd_sarees_token') && localStorage.getItem('kd_sarees_user'))
const isAdminLoggedIn = () =>
  localStorage.getItem('kd_sarees_admin_session') === 'true' && Boolean(localStorage.getItem('kd_sarees_admin_token'))

function GuestOnlyRoute({ children }) {
  if (isAdminLoggedIn()) {
    return <Navigate to="/admin/dashboard" replace />
  }
  return isUserLoggedIn() ? <Navigate to="/profile" replace /> : children
}

function ProtectedUserRoute({ children }) {
  if (isAdminLoggedIn()) {
    return <Navigate to="/admin/dashboard" replace />
  }
  return isUserLoggedIn() ? children : <Navigate to="/auth" replace />
}

function HomePage({ showLoginPopup = false, showSignupPopup = false }) {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsResult, reviewsResult] = await Promise.allSettled([api.getProducts(), api.getReviews()])
        const productsData = productsResult.status === 'fulfilled' ? productsResult.value : []
        const reviewsData = reviewsResult.status === 'fulfilled' ? reviewsResult.value : []
        const mappedProducts = (productsData || []).map((p) => ({
          id: p._id,
          imageSrc: p.images?.[0] || '',
          imageSrcHover: p.images?.[1] || p.images?.[0] || '',
          imageAlt: p.name,
          productTitle: p.name,
          originalPrice: Math.round((p.price || 0) * 1.25),
          currentPrice: p.price || 0,
          discountPercentage: 20,
          rating: 4.5,
          reviewCount: 0,
          isSale: true,
          showAddToCartButton: true,
          href: '#',
        }))
        const mappedReviews = (reviewsData || []).map((r) => ({
          id: r._id,
          imageSrc: r.imageSrc || '',
          imageAlt: r.product?.name || 'Product',
          reviewText: r.comment,
          rating: r.rating,
          reviewerName: r.user?.name || 'Customer',
          verified: true,
          productVariant: r.product?.name || '',
        }))
        if (mappedProducts.length) {
          setProducts(mappedProducts)
        }
        if (mappedReviews.length) {
          setReviews(mappedReviews)
        }
      } catch {
        // Keep static fallbacks in child components.
      }
    }
    loadData()
  }, [])

  const handleAddToCart = async (productId) => {
    try {
      await api.addToCart({ productId, quantity: 1 })
      navigate('/cart')
    } catch (err) {
      window.alert(err.message || 'Please login to add item to cart')
    }
  }

  const handleAddReview = async (payload) => {
    try {
      const hasUserToken = Boolean(localStorage.getItem('kd_sarees_token'))
      if (!hasUserToken) {
        throw new Error('Please login first to submit a review.')
      }
      let currentProductId = products[0]?.id
      if (!currentProductId) {
        const productsData = await api.getProducts()
        currentProductId = productsData?.[0]?._id
      }
      if (!currentProductId) {
        throw new Error('No product found to attach this review.')
      }
      await api.addReview({
        product: currentProductId,
        rating: payload.rating,
        comment: payload.reviewText,
        imageSrc: payload.imageSrc || '',
      })
      return true
    } catch (err) {
      throw new Error(err?.message || 'Unable to save review to server')
    }
  }

  const productDataForUi = useMemo(() => (products.length ? products : undefined), [products])
  const reviewDataForUi = useMemo(() => (reviews.length ? reviews : undefined), [reviews])

  return (
    <>
      <OfferTicker />
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesStrip />
        <TopCategories />
        <GudiPadwaHero />
        <ProductSection products={productDataForUi} onAddToCart={handleAddToCart} />
        <SareeStoreSection />
        <SilkSareeSection />
        <BestsellerSareesSection />
        <StoryLookbookSection />
        <CustomerReviewsSection reviews={reviewDataForUi} onAddReview={handleAddReview} />
      </main>
      <Footer />
      {showLoginPopup ? <LoginPage isPopup onClose={() => navigate('/', { replace: true })} /> : null}
      {showSignupPopup ? <SignupPage isPopup onClose={() => navigate('/', { replace: true })} /> : null}
    </>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/auth"
        element={
          <GuestOnlyRoute>
            <AuthEntryPage />
          </GuestOnlyRoute>
        }
      />
      <Route
        path="/login"
        element={
          <GuestOnlyRoute>
            <HomePage showLoginPopup />
          </GuestOnlyRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <GuestOnlyRoute>
            <HomePage showSignupPopup />
          </GuestOnlyRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedUserRoute>
            <UserInfoPage />
          </ProtectedUserRoute>
        }
      />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route element={<AdminRoute />}>
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      </Route>
    </Routes>
  )
}

export default App
