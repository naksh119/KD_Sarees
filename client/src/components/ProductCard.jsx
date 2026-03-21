/**
 * Reusable product card for saree/product grids.
 * - Image area: swaps to hover image on hover when imageSrcHover is provided.
 * - ADD TO CART: full-width dark blue button below image when showAddToCartButton.
 * - Title, struck-through original price, bold sale price, red discount badge, stars, review count.
 */

export default function ProductCard({
  id,
  imageSrc,
  imageSrcHover,
  imageAlt,
  productTitle,
  originalPrice,
  currentPrice,
  discountPercentage,
  rating = 0,
  reviewCount = 0,
  isSale = false,
  showAddToCartButton = false,
  href = '#',
  onAddToCart,
}) {
  const formatPrice = (n) => (n != null ? `₹ ${Number(n).toLocaleString('en-IN')}` : '');

  // Support partial stars (e.g. 4.5 → 4 full + 1 half)
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.25 && rating % 1 < 0.75;
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (i < fullStars) {
      return <span key={i} className="text-blue-700" aria-hidden>★</span>;
    }
    if (i === fullStars && hasHalf) {
      return (
        <span key={i} className="relative inline-block text-slate-300" aria-hidden>
          ★
          <span className="absolute left-0 top-0 w-1/2 overflow-hidden text-blue-700">★</span>
        </span>
      );
    }
    return <span key={i} className="text-slate-300" aria-hidden>★</span>;
  });

  const imageBlock = (
    <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
      {/* Main image - smooth fade out on hover when hover image exists */}
      <img
        src={imageSrc}
        alt={imageAlt ?? productTitle}
        className={`h-full w-full object-cover object-center transition-all duration-1000 ease-in-out ${imageSrcHover ? 'group-hover:opacity-0 group-hover:scale-105' : 'group-hover:scale-105'}`}
      />
      {/* Hover image - smooth fade in on card hover */}
      {imageSrcHover && (
        <img
          src={imageSrcHover}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-center opacity-0 transition-all duration-1000 ease-in-out group-hover:opacity-100 group-hover:scale-105"
        />
      )}

      {isSale && (
        <span
          className="absolute top-2 left-2 rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-bold uppercase text-slate-900"
          aria-hidden
        >
          Sale
        </span>
      )}

      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
        className="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-blue-500 bg-white text-blue-500 shadow hover:bg-blue-50 transition-colors"
        aria-label="Add to wishlist"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      {/* Add to cart - appears on hover with same transition as image */}
      {showAddToCartButton && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onAddToCart) onAddToCart(id);
          }}
          className="absolute left-0 right-0 bottom-0 translate-y-full rounded-lg bg-[#c4a77d] py-3 text-base font-bold uppercase tracking-wide text-[#2c1810] opacity-0 transition-all duration-1000 ease-in-out group-hover:translate-y-0 group-hover:opacity-100 hover:bg-[#b8956a]"
        >
          Add to cart
        </button>
      )}
    </div>
  );

  const card = (
    <article className="product-card group relative flex flex-col w-full overflow-hidden rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow">
      {imageBlock}

      <div className="flex flex-col flex-1 p-3 text-left">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800 line-clamp-2 min-h-[2.5rem]">
          {productTitle}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          {originalPrice != null && originalPrice > (currentPrice ?? 0) && (
            <span className="text-sm text-slate-400 line-through">{formatPrice(originalPrice)}</span>
          )}
          <span className="text-base font-bold text-red-700">{formatPrice(currentPrice)}</span>
          {discountPercentage != null && (
            <span className="rounded bg-red-600 px-1.5 py-0.5 text-xs font-semibold text-white">
              -{discountPercentage}%
            </span>
          )}
        </div>

        <div className="mt-2 flex items-center gap-1 text-sm text-slate-800">
          <span className="flex">{stars}</span>
          {reviewCount > 0 && (
            <span className="ml-1">({reviewCount})</span>
          )}
        </div>
      </div>
    </article>
  );

  if (href) {
    return (
      <a href={href} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-xl">
        {card}
      </a>
    );
  }

  return card;
}
