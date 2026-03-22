import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import { mapApiProducts } from '../utils/mapProduct'
import { getFavorites, isFavoriteProduct, toggleFavorite } from '../utils/favorites'

/**
 * Loads products for storefront listing pages; optional category Mongo id.
 * sort: 'new' = newest first, 'default' = API order
 */
export function useStorefrontCatalog({
  categoryId = null,
  sort = 'default',
  onAddedToCart,
  requireCategory = false,
} = {}) {
  const navigate = useNavigate()
  const location = useLocation()
  const [rawProducts, setRawProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [addingToCartProductId, setAddingToCartProductId] = useState('')
  const [favoritesCount, setFavoritesCount] = useState(0)

  useEffect(() => {
    const syncFavoritesCount = () => setFavoritesCount(getFavorites().length)
    syncFavoritesCount()
    window.addEventListener('favorites:changed', syncFavoritesCount)
    return () => window.removeEventListener('favorites:changed', syncFavoritesCount)
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (requireCategory && !categoryId) {
        setRawProducts([])
        setIsLoading(false)
        return
      }
      try {
        setIsLoading(true)
        const data = await api.getProducts(categoryId ? { category: categoryId } : {})
        if (cancelled) return
        let mapped = mapApiProducts(data || [])
        if (sort === 'new') {
          mapped = [...mapped].sort((a, b) => {
            const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0
            const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0
            return tb - ta
          })
        }
        if (sort === 'priceDesc') {
          mapped = [...mapped].sort((a, b) => (b.currentPrice || 0) - (a.currentPrice || 0))
        }
        setRawProducts(mapped)
      } catch {
        if (!cancelled) setRawProducts([])
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [categoryId, sort, requireCategory])

  const products = useMemo(() => rawProducts, [rawProducts])

  const handleAddToCart = async (productId) => {
    if (!productId || addingToCartProductId === String(productId)) return
    const productTitle =
      rawProducts.find((p) => String(p.id) === String(productId))?.productTitle ?? ''
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
      onAddedToCart?.({ productTitle })
    } catch (err) {
      window.alert(err.message || 'Unable to add item to cart')
    } finally {
      setAddingToCartProductId('')
    }
  }

  const handleToggleFavorite = useCallback((product) => {
    toggleFavorite(product)
    setFavoritesCount(getFavorites().length)
  }, [])

  return {
    products,
    isLoading,
    addingToCartProductId,
    favoritesCount,
    handleAddToCart,
    handleToggleFavorite,
    isFavorite: isFavoriteProduct,
  }
}
