/**
 * Product grid section – uses ProductCard with data passed via props.
 * Includes VIEW ALL CTA. Supports hover image swap via imageSrcHover.
 */

import ProductCard from './ProductCard';

export default function ProductSection({
  products = [],
  isLoading = false,
  viewAllHref = '#',
  onAddToCart,
  addingToCartProductId,
  onToggleFavorite,
  isFavorite,
  title = 'Featured Products',
  sectionId = 'new-arrivals',
  headingId = 'product-section-heading',
  hideViewAll = false,
  showHeading = true,
}) {
  const hasProducts = Array.isArray(products) && products.length > 0;
  const sectionProps =
    showHeading && title
      ? { 'aria-labelledby': headingId }
      : { 'aria-label': 'Products' };

  return (
    <section
      {...(sectionId ? { id: sectionId } : {})}
      className="w-full py-12 md:py-16 scroll-mt-28"
      {...sectionProps}
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {showHeading && title ? (
          <h2
            id={headingId}
            className="text-center text-2xl font-bold uppercase tracking-wider text-slate-800 md:text-3xl"
          >
            {title}
          </h2>
        ) : null}
        <div
          className={`${showHeading && title ? 'mt-8' : 'mt-0'} flex gap-4 overflow-x-auto overflow-y-hidden pb-2 snap-x snap-mandatory hide-scrollbar sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible lg:grid-cols-4 lg:gap-8`}
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {isLoading &&
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`product-skeleton-${index}`}
                className="shrink-0 w-full snap-start sm:w-auto overflow-hidden rounded-xl bg-white shadow-md"
                aria-hidden
              >
                <div className="aspect-[3/4] w-full animate-pulse bg-slate-200" />
                <div className="p-3">
                  <div className="h-4 w-4/5 animate-pulse rounded bg-slate-200" />
                  <div className="mt-2 h-4 w-3/5 animate-pulse rounded bg-slate-200" />
                  <div className="mt-3 h-5 w-2/5 animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            ))}

          {!isLoading && !hasProducts && (
            <p className="col-span-full py-12 text-center text-sm text-slate-600 sm:col-span-2 lg:col-span-4">
              No products to show yet.
            </p>
          )}

          {!isLoading &&
            hasProducts &&
            products.map((product) => (
              <div key={product.id} className="shrink-0 w-full snap-start sm:w-auto">
                <ProductCard
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
                  onAddToCart={onAddToCart}
                  isAddToCartLoading={addingToCartProductId === String(product.id)}
                  onToggleFavorite={() => onToggleFavorite?.(product)}
                  isFavorite={Boolean(isFavorite?.(product.id))}
                />
              </div>
            ))}
        </div>

        {!isLoading && hasProducts && viewAllHref && !hideViewAll && (
          <div className="mt-10 flex justify-center">
            <a
              href={viewAllHref}
              className="rounded-md bg-[#c4a77d] px-14 py-3 text-base font-bold uppercase tracking-wide text-[#2c1810] hover:bg-[#b8956a] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c4a77d] focus-visible:ring-offset-2"
            >
              View all
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
