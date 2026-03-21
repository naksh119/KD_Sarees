/**
 * Reusable customer review card.
 * Props: imageSrc, imageAlt, reviewText, rating, reviewerName, verified, productVariant.
 */

function StarRating({ rating = 0 }) {
  const fullStars = Math.min(5, Math.floor(rating));
  const stars = Array.from({ length: 5 }, (_, i) => (
    <span
      key={i}
      className={i < fullStars ? 'text-blue-700' : 'text-slate-300'}
      aria-hidden
    >
      ★
    </span>
  ));
  return <span className="flex text-lg sm:text-xl">{stars}</span>;
}

export default function ReviewCard({
  imageSrc,
  imageAlt = 'Product',
  reviewText,
  rating = 5,
  reviewerName,
  verified = false,
  productVariant,
}) {
  return (
    <article className="flex h-[300px] w-full shrink-0 flex-col overflow-hidden rounded-lg bg-white shadow-md">
      <div className="mt-[5px] flex h-[150px] w-full max-w-[150px] shrink-0 items-center justify-center self-center overflow-hidden rounded-lg bg-slate-100">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={imageAlt}
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <span className="text-xs font-medium text-slate-500">No image</span>
        )}
      </div>
      <div className="flex flex-1 flex-col px-2 py-2 text-left min-w-0">
        <p className="text-xs text-slate-800 line-clamp-3 leading-tight">
          {reviewText}
        </p>
        <div className="mt-1.5 flex items-center justify-center gap-0.5 sm:justify-start">
          <StarRating rating={rating} />
        </div>
        <div className="mt-1.5 flex items-center gap-1 min-w-0">
          <span className="text-xs font-bold text-slate-900 truncate">
            {reviewerName}
          </span>
          {verified && (
            <span
              className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-[#1e3a5f] text-white"
              aria-label="Verified purchase"
            >
              <svg className="h-2 w-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
          )}
        </div>
        {productVariant && (
          <p className="mt-0.5 text-[10px] text-slate-500 truncate">{productVariant}</p>
        )}
      </div>
    </article>
  );
}
