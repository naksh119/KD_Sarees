import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import OfferTicker from '../components/OfferTicker'
import Footer from '../components/footer/Footer'
import ConfirmPopup from '../components/ConfirmPopup'
import CartSuccessPopup from '../components/CartSuccessPopup'
import ProductCard from '../components/ProductCard'
import { api } from '../utils/api'
import { getFavorites, removeFavoriteById, toggleFavorite } from '../utils/favorites'

function FavoritesItem() {
  const navigate = useNavigate()
  const location = useLocation()
  const [favorites, setFavorites] = useState([])
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [addingToCartProductId, setAddingToCartProductId] = useState('')
  const [cartSuccess, setCartSuccess] = useState({ open: false, productTitle: '' })

  useEffect(() => {
    const syncFavorites = () => {
      setFavorites(getFavorites())
    }

    syncFavorites()
    window.addEventListener('favorites:changed', syncFavorites)
    return () => window.removeEventListener('favorites:changed', syncFavorites)
  }, [])

  const handleToggleFavorite = (product) => {
    const nextFavorites = toggleFavorite(product)
    setFavorites(nextFavorites)
  }

  const handleDeleteFavorite = async (product) => {
    const nextFavorites = await removeFavoriteById(product?.id)
    setFavorites(nextFavorites)
    setDeleteTarget(null)
  }

  const handleAddToCart = async (productId) => {
    if (!productId || addingToCartProductId === String(productId)) return
    const productTitle =
      favorites.find((p) => String(p.id) === String(productId))?.productTitle ?? ''
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

  return (
    <>
      <CartSuccessPopup
        isOpen={cartSuccess.open}
        onClose={() => setCartSuccess((s) => ({ ...s, open: false }))}
        productTitle={cartSuccess.productTitle}
        onViewCart={() => navigate('/cart')}
      />
      <OfferTicker />
      <Navbar favoritesCount={favorites.length} hasTopTicker />
      <main className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-wide text-slate-800">
          Favorite List
        </h1>

        {favorites.length === 0 ? (
          <p className="mt-6 text-slate-600">No favorites yet. Tap the heart on any product card to add it here.</p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                onToggleFavorite={() => handleToggleFavorite(product)}
                isFavorite
                showDeleteIcon
                onDelete={() => setDeleteTarget(product)}
                onAddToCart={handleAddToCart}
                isAddToCartLoading={addingToCartProductId === String(product.id)}
              />
            ))}
          </div>
        )}
      </main>
      <ConfirmPopup
        isOpen={Boolean(deleteTarget)}
        title="Remove from favorites?"
        message={
          deleteTarget?.productTitle
            ? `"${deleteTarget.productTitle}" will be removed from your favorites.`
            : 'This product will be removed from your favorites.'
        }
        confirmText="Yes, remove"
        cancelText="Cancel"
        onConfirm={() => handleDeleteFavorite(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />
      <Footer />
    </>
  )
}

export default FavoritesItem
