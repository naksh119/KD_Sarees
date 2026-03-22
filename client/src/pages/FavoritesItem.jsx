import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import OfferTicker from '../components/OfferTicker'
import Footer from '../components/footer/Footer'
import ConfirmPopup from '../components/ConfirmPopup'
import ProductCard from '../components/ProductCard'
import { getFavorites, removeFavoriteById, toggleFavorite } from '../utils/favorites'

function FavoritesItem() {
  const [favorites, setFavorites] = useState([])
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => {
    const syncFavorites = () => {
      setFavorites(getFavorites())
    }

    syncFavorites()
    window.addEventListener('favorites:changed', syncFavorites)
    return () => window.removeEventListener('favorites:changed', syncFavorites)
  }, [])

  const handleToggleFavorite = async (product) => {
    const nextFavorites = await toggleFavorite(product)
    setFavorites(nextFavorites)
  }

  const handleDeleteFavorite = async (product) => {
    const nextFavorites = await removeFavoriteById(product?.id)
    setFavorites(nextFavorites)
    setDeleteTarget(null)
  }

  return (
    <>
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
