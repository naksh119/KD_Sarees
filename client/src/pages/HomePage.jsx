import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import GudiPadwaHero from '../components/GudiPadwaHero'
import FeaturesStrip from '../components/FeaturesStrip'
import TopCategories from '../components/TopCategories'
import SareeStoreSection from '../components/SareeStoreSection'
import SilkSareeSection from '../components/SilkSareeSection'
import ProductSection from '../components/ProductSection'
import BestsellerSareesSection from '../components/BestsellerSareesSection'
import StoryLookbookSection from '../components/StoryLookbookSection'
import CustomerReviewsSection from '../components/CustomerReviewsSection'
import CartSuccessPopup from '../components/CartSuccessPopup'
import Footer from '../components/footer/Footer'
import OfferTicker from '../components/OfferTicker'
import { api } from '../utils/api'
import { mapApiProducts } from '../utils/mapProduct'
import { getFavorites, isFavoriteProduct, toggleFavorite } from '../utils/favorites'

function HomePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [products, setProducts] = useState([])
  const [reviews, setReviews] = useState([])
  const [favoritesCount, setFavoritesCount] = useState(0)
  const [addingToCartProductId, setAddingToCartProductId] = useState('')
  const [cartSuccess, setCartSuccess] = useState({ open: false, productTitle: '' })
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsResult, reviewsResult] = await Promise.allSettled([api.getProducts(), api.getReviews()])
        const productsData = productsResult.status === 'fulfilled' ? productsResult.value : []
        const reviewsData = reviewsResult.status === 'fulfilled' ? reviewsResult.value : []
        const mappedProducts = mapApiProducts(productsData || [])
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
        setReviews(mappedReviews)
      } catch {
        // Keep empty arrays if API is unavailable.
      } finally {
        setIsLoadingProducts(false)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    const syncFavoritesCount = () => {
      setFavoritesCount(getFavorites().length)
    }

    syncFavoritesCount()
    window.addEventListener('favorites:changed', syncFavoritesCount)
    return () => window.removeEventListener('favorites:changed', syncFavoritesCount)
  }, [])

  const handleAddToCart = async (productId) => {
    if (!productId || addingToCartProductId === String(productId)) return
    const productTitle =
      products.find((p) => String(p.id) === String(productId))?.productTitle ?? ''
    try {
      setAddingToCartProductId(String(productId))
      const hasUserToken = Boolean(localStorage.getItem('kd_sarees_token'))
      if (!hasUserToken) {
        navigate('/auth', { state: { backgroundLocation: location } })
        return
      }
      const isMongoId = /^[a-f\d]{24}$/i.test(String(productId))
      if (!isMongoId) {
        throw new Error('Product is not synced from database yet. Please refresh and try again.')
      }
      await api.addToCart({ productId, quantity: 1 })
      setCartSuccess({ open: true, productTitle })
    } catch (err) {
      window.alert(err.message || 'Unable to add item to cart')
    } finally {
      setAddingToCartProductId('')
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
      const reviewsData = await api.getReviews()
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
      setReviews(mappedReviews)
      return true
    } catch (err) {
      throw new Error(err?.message || 'Unable to save review to server')
    }
  }

  const handleToggleFavorite = async (product) => {
    await toggleFavorite(product)
    setFavoritesCount(getFavorites().length)
  }

  const productDataForUi = useMemo(() => products, [products])
  const reviewDataForUi = useMemo(() => reviews, [reviews])

  return (
    <>
      <CartSuccessPopup
        isOpen={cartSuccess.open}
        onClose={() => setCartSuccess((s) => ({ ...s, open: false }))}
        productTitle={cartSuccess.productTitle}
        onViewCart={() => navigate('/cart')}
      />
      <OfferTicker />
      <Navbar favoritesCount={favoritesCount} hasTopTicker />
      <main>
        <HeroSection />
        <FeaturesStrip />
        <TopCategories />
        <GudiPadwaHero />
        <ProductSection
          products={productDataForUi}
          isLoading={isLoadingProducts}
          onAddToCart={handleAddToCart}
          addingToCartProductId={addingToCartProductId}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={isFavoriteProduct}
        />
        <SareeStoreSection />
        <SilkSareeSection />
        <BestsellerSareesSection />
        <StoryLookbookSection />
        <CustomerReviewsSection
          reviews={reviewDataForUi}
          isLoading={isLoadingProducts}
          onAddReview={handleAddReview}
        />
      </main>
      <Footer />
    </>
  )
}

export default HomePage
