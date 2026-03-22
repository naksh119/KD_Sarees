/**
 * Shared product grid for New Arrivals, Best Sellers, and category routes.
 */

import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StorefrontLayout from '../components/StorefrontLayout'
import ProductSection from '../components/ProductSection'
import CartSuccessPopup from '../components/CartSuccessPopup'
import { useStorefrontCatalog } from '../hooks/useStorefrontCatalog'

export default function ProductListingPage({
  title,
  categoryId = null,
  sort = 'default',
  description = null,
  requireCategory = false,
}) {
  const navigate = useNavigate()
  const [cartSuccess, setCartSuccess] = useState({ open: false, productTitle: '' })

  const catalog = useStorefrontCatalog({
    categoryId,
    sort,
    requireCategory,
    onAddedToCart: ({ productTitle }) => setCartSuccess({ open: true, productTitle }),
  })

  const headingId = useMemo(
    () => `listing-heading-${title.replace(/\s+/g, '-').toLowerCase()}`,
    [title],
  )

  return (
    <>
      <CartSuccessPopup
        isOpen={cartSuccess.open}
        onClose={() => setCartSuccess((s) => ({ ...s, open: false }))}
        productTitle={cartSuccess.productTitle}
        onViewCart={() => navigate('/cart')}
      />
      <StorefrontLayout favoritesCount={catalog.favoritesCount}>
        <div className="mx-auto max-w-[1400px] px-4 pt-8 pb-4 sm:px-6 lg:px-8">
          <h1 className="text-center text-3xl font-bold uppercase tracking-wider text-slate-800 md:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-slate-600 md:text-base">
              {description}
            </p>
          ) : null}
        </div>
        <ProductSection
          showHeading={false}
          sectionId={undefined}
          headingId={headingId}
          products={catalog.products}
          isLoading={catalog.isLoading}
          viewAllHref=""
          hideViewAll
          onAddToCart={catalog.handleAddToCart}
          addingToCartProductId={catalog.addingToCartProductId}
          onToggleFavorite={catalog.handleToggleFavorite}
          isFavorite={catalog.isFavorite}
        />
      </StorefrontLayout>
    </>
  )
}
