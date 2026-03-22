/**
 * Customer Reviews section – carousel of ReviewCard, View all / Add review modals.
 * Reviews come from the API (parent passes `reviews`); no placeholder/demo data.
 */

import { useRef, useEffect, useState, useMemo } from 'react';
import ReviewCard from './ReviewCard';
import ReviewCardSkeleton from './ReviewCardSkeleton';
import ReviewSuccessPopup from './ReviewSuccessPopup';

const DESKTOP_CARD_WIDTH = 160;
const CARD_GAP = 16;
const DESKTOP_CARDS_PER_PAGE = 5;

function chunkReviews(reviews, size) {
  const chunks = [];
  for (let i = 0; i < reviews.length; i += size) {
    chunks.push(reviews.slice(i, i + size));
  }
  return chunks;
}

function ModalOverlay({
  open,
  onClose,
  title,
  children,
  panelClassName = 'max-w-4xl rounded-xl',
  bodyClassName = 'min-h-0 flex-1 overflow-y-auto p-4',
  headerClassName = 'flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3',
  titleClassName = 'text-lg font-bold text-slate-800',
  closeButtonClassName = 'rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800',
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevHtmlOverscroll = document.documentElement.style.overscrollBehavior;

    // Lock page scroll while modal is open without changing body positioning.
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.overscrollBehavior = 'none';
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.documentElement.style.overscrollBehavior = prevHtmlOverscroll;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/45 p-0 sm:items-center sm:p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-modal-title"
        className={`relative mx-auto flex h-full max-h-full w-full overflow-y-auto rounded-none bg-white shadow-xl sm:h-auto sm:max-h-[90vh] ${panelClassName} flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={headerClassName}>
          <div className="relative w-full">
            <h3 id="review-modal-title" className={`${titleClassName} text-center`}>
              {title}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className={`${closeButtonClassName} absolute right-0 top-1/2 -translate-y-1/2`}
              aria-label="Close dialog"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className={bodyClassName}>{children}</div>
      </div>
    </div>
  );
}

function AddReviewForm({ onSubmit, onCancel }) {
  const [reviewerName, setReviewerName] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [productVariant, setProductVariant] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [imageName, setImageName] = useState('');
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState('');

  useEffect(() => {
    if (!imagePreviewOpen) return;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevHtmlOverscroll = document.documentElement.style.overscrollBehavior;

    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.overscrollBehavior = 'none';
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.documentElement.style.overscrollBehavior = prevHtmlOverscroll;
    };
  }, [imagePreviewOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setImageSrc('');
      setImageName('');
      setImageError('');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setImageError('Please upload a valid image file.');
      setImageSrc('');
      setImageName('');
      return;
    }
    const maxBytes = 2 * 1024 * 1024;
    if (file.size > maxBytes) {
      setImageError('Image size must be 2MB or less.');
      setImageSrc('');
      setImageName('');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(typeof reader.result === 'string' ? reader.result : '');
      setImageName(file.name);
      setImageError('');
    };
    reader.onerror = () => {
      setImageError('Unable to read the selected image.');
      setImageSrc('');
      setImageName('');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = reviewerName.trim();
    const text = reviewText.trim();
    if (!name) {
      setError('Please enter your name.');
      return;
    }
    if (text.length < 10) {
      setError('Review must be at least 10 characters.');
      return;
    }
    setError('');
    try {
      await onSubmit({
        reviewerName: name,
        rating,
        reviewText: text,
        productVariant: productVariant.trim() || 'General',
        imageSrc: imageSrc || '',
      });
      setReviewerName('');
      setReviewText('');
      setProductVariant('');
      setRating(5);
      setImageSrc('');
      setImageName('');
      setImagePreviewOpen(false);
      setImageError('');
    } catch (err) {
      setError(err?.message || 'Unable to submit review.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-4">
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      <div>
        <label htmlFor="review-name" className="mb-1 block text-sm font-medium text-slate-700">
          Your name
        </label>
        <input
          id="review-name"
          type="text"
          value={reviewerName}
          onChange={(e) => setReviewerName(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-[#c4a77d] focus:outline-none focus:ring-2 focus:ring-[#c4a77d]/40"
          placeholder="e.g. Priya S."
          maxLength={80}
          autoComplete="name"
        />
      </div>
      <div>
        <span className="mb-1 block text-sm font-medium text-slate-700">Rating</span>
        <div className="flex gap-1" role="group" aria-label="Star rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              className={`text-2xl transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c4a77d] rounded ${
                n <= rating ? 'text-amber-400' : 'text-slate-300'
              }`}
              aria-label={`${n} star${n > 1 ? 's' : ''}`}
              aria-pressed={rating === n}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="review-text" className="mb-1 block text-sm font-medium text-slate-700">
          Your review
        </label>
        <textarea
          id="review-text"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows={4}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-[#c4a77d] focus:outline-none focus:ring-2 focus:ring-[#c4a77d]/40"
          placeholder="Share your experience with the saree..."
          maxLength={500}
        />
      </div>
      <div>
        <label htmlFor="review-product" className="mb-1 block text-sm font-medium text-slate-700">
          Product (optional)
        </label>
        <input
          id="review-product"
          type="text"
          value={productVariant}
          onChange={(e) => setProductVariant(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-[#c4a77d] focus:outline-none focus:ring-2 focus:ring-[#c4a77d]/40"
          placeholder="e.g. Teal Green Silk"
          maxLength={60}
        />
      </div>
      <div>
        <label htmlFor="review-image" className="mb-1 block text-sm font-medium text-slate-700">
          Product image (optional)
        </label>
        <div className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-2 py-2">
          <label
            htmlFor="review-image"
            className="cursor-pointer rounded-md bg-[#c4a77d]/20 px-3 py-1.5 text-sm font-semibold text-[#2c1810] transition-colors hover:bg-[#c4a77d]/30"
          >
            Upload
          </label>
          <input
            id="review-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="sr-only"
          />
          <span className="min-w-0 flex-1 truncate text-sm text-slate-700">
            {imageName || 'No file chosen'}
          </span>
          <button
            type="button"
            onClick={() => setImagePreviewOpen(true)}
            disabled={!imageSrc}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            View
          </button>
        </div>
        {imageError ? (
          <p className="mt-1 text-xs text-red-700">{imageError}</p>
        ) : null}
      </div>
      {imagePreviewOpen && imageSrc ? (
        <div
          className="fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto bg-black/45 p-0 sm:items-center sm:p-4"
          role="presentation"
          onClick={() => setImagePreviewOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Uploaded image preview"
            className="relative h-full w-full rounded-none bg-white p-3 shadow-xl sm:h-auto sm:max-h-[90vh] sm:max-w-lg sm:rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setImagePreviewOpen(false)}
              className="absolute right-2 top-2 rounded-md p-1 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
              aria-label="Close image preview"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={imageSrc}
              alt="Uploaded product preview"
              className="h-full max-h-[85vh] w-full rounded-lg object-contain sm:max-h-[70vh]"
            />
          </div>
        </div>
      ) : null}
      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          className="rounded-md bg-[#c4a77d] px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-[#2c1810] hover:bg-[#b8956a] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c4a77d] focus-visible:ring-offset-2"
        >
          Submit review
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function CustomerReviewsSection({
  reviews = [],
  isLoading = false,
  autoScrollIntervalMs = 4000,
  onAddReview,
}) {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [viewAllOpen, setViewAllOpen] = useState(false);
  const [addReviewOpen, setAddReviewOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [loginRequiredPopupOpen, setLoginRequiredPopupOpen] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window === 'undefined' ? 1280 : window.innerWidth
  );

  const displayReviews = useMemo(() => (Array.isArray(reviews) ? reviews : []), [reviews]);
  const isMobile = viewportWidth < 640;
  const cardsPerPage = isMobile ? 1 : DESKTOP_CARDS_PER_PAGE;
  const cardWidth = isMobile
    ? Math.min(300, Math.max(220, viewportWidth - 88))
    : DESKTOP_CARD_WIDTH;
  const pageWidth = cardsPerPage * cardWidth + (cardsPerPage - 1) * CARD_GAP;
  const reviewPages = useMemo(
    () => chunkReviews(displayReviews, cardsPerPage),
    [displayReviews, cardsPerPage]
  );
  const getScrollStep = (el) => (isMobile ? el.clientWidth : pageWidth);

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleAddReview = async (payload) => {
    if (onAddReview) {
      await onAddReview(payload);
    }
    setAddReviewOpen(false);
    setSuccessOpen(true);
  };

  const handleAddReviewClick = () => {
    const hasUserToken = Boolean(localStorage.getItem('kd_sarees_token'));
    if (!hasUserToken) {
      setLoginRequiredPopupOpen(true);
      return;
    }
    setAddReviewOpen(true);
  };

  useEffect(() => {
    if (!successOpen) return undefined;
    const timeoutId = window.setTimeout(() => {
      setSuccessOpen(false);
    }, 2600);
    return () => window.clearTimeout(timeoutId);
  }, [successOpen]);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const step = getScrollStep(el);
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (direction === 'right') {
      const next = el.scrollLeft + step;
      if (next >= maxScroll) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: step, behavior: 'smooth' });
      }
    } else {
      const prev = el.scrollLeft - step;
      if (prev <= 0) {
        el.scrollTo({ left: maxScroll, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: -step, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    if (isLoading || isPaused) return;
    const id = setInterval(() => {
      if (!scrollRef.current) return;
      const el = scrollRef.current;
      const step = getScrollStep(el);
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return;
      const next = el.scrollLeft + step;
      if (next >= maxScroll) {
        // Reset to first card when reaching last (instant, then loop continues)
        el.scrollTo({ left: 0, behavior: 'auto' });
      } else {
        el.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, autoScrollIntervalMs);
    return () => clearInterval(id);
  }, [isLoading, isPaused, autoScrollIntervalMs, isMobile, pageWidth]);

  return (
    <section
      className="w-full py-12 md:py-16 bg-slate-50"
      aria-labelledby="customer-reviews-heading"
      aria-busy={isLoading}
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <h2
          id="customer-reviews-heading"
          className="text-center text-2xl font-bold uppercase tracking-wider text-slate-800 md:text-3xl"
        >
          Customer Reviews
        </h2>

        <ModalOverlay
          open={viewAllOpen}
          onClose={() => setViewAllOpen(false)}
          title="All customer reviews"
          panelClassName="max-w-[46rem] overflow-hidden sm:rounded-xl"
          headerClassName="flex shrink-0 items-center justify-between border-b border-[#c4a77d] bg-[#c4a77d] px-4 py-3 sm:rounded-t-xl"
          titleClassName="text-lg font-bold text-[#2c1810]"
          closeButtonClassName="rounded-lg p-2 text-[#2c1810]/85 transition-colors hover:bg-[#b8956a] hover:text-[#2c1810]"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {displayReviews.map((review) => (
              <div key={review.id} className="flex justify-center">
                <ReviewCard
                  imageSrc={review.imageSrc}
                  imageAlt={review.imageAlt}
                  reviewText={review.reviewText}
                  rating={review.rating}
                  reviewerName={review.reviewerName}
                  verified={review.verified}
                  productVariant={review.productVariant}
                />
              </div>
            ))}
          </div>
        </ModalOverlay>

        <ModalOverlay
          open={addReviewOpen}
          onClose={() => setAddReviewOpen(false)}
          title="Write a review"
          panelClassName="max-w-2xl border border-[#e6d7c2] sm:rounded-2xl"
          bodyClassName="p-4"
          headerClassName="flex shrink-0 items-center justify-between border-b border-[#c4a77d] bg-[#c4a77d] px-4 py-3 sm:rounded-t-2xl"
          titleClassName="text-lg font-bold text-[#2c1810]"
          closeButtonClassName="rounded-lg p-2 text-[#2c1810]/85 transition-colors hover:bg-[#b8956a] hover:text-[#2c1810]"
        >
          <AddReviewForm
            onSubmit={handleAddReview}
            onCancel={() => setAddReviewOpen(false)}
          />
        </ModalOverlay>

        <ReviewSuccessPopup
          isOpen={successOpen}
          onClose={() => setSuccessOpen(false)}
          message="Thank you for your feedback"
        />
        <ReviewSuccessPopup
          isOpen={loginRequiredPopupOpen}
          onClose={() => setLoginRequiredPopupOpen(false)}
          message="Please login first to submit a review."
          description="You need to be logged in before adding a review."
          variant="error"
        />

        {isLoading ? (
          <div
            className="relative mt-8 flex justify-center overflow-hidden"
            role="status"
            aria-label="Loading reviews"
          >
            <div
              className="relative flex items-center justify-center gap-2 px-2"
              style={{ width: isMobile ? '100%' : pageWidth + 96 }}
            >
              {!isMobile ? (
                <div
                  className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 opacity-50"
                  aria-hidden
                >
                  <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
              ) : null}
              <div className="shrink-0 overflow-hidden" style={{ width: isMobile ? '100%' : pageWidth }}>
                <div
                  className="flex justify-center"
                  style={{
                    width: isMobile ? '100%' : pageWidth,
                    gap: CARD_GAP,
                  }}
                >
                  {Array.from({ length: cardsPerPage }, (_, i) => (
                    <div key={`review-skel-${i}`} className="shrink-0" style={{ width: cardWidth }}>
                      <ReviewCardSkeleton />
                    </div>
                  ))}
                </div>
              </div>
              {!isMobile ? (
                <div
                  className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 opacity-50"
                  aria-hidden
                >
                  <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              ) : null}
            </div>
          </div>
        ) : displayReviews.length === 0 ? (
          <p className="mt-8 text-center text-slate-600">
            No customer reviews yet. Be the first to share your experience.
          </p>
        ) : (
          <div
            className="relative mt-8 flex justify-center overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              className="relative flex items-center justify-center gap-2 px-2"
              style={{ width: isMobile ? '100%' : pageWidth + 96 }}
            >
              {!isMobile ? (
                <button
                  type="button"
                  onClick={() => scroll('left')}
                  className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#c4a77d] bg-[#c4a77d] text-[#2c1810] shadow-md hover:bg-[#b8956a] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c4a77d] focus-visible:ring-offset-2"
                  aria-label="Previous 5 reviews"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              ) : null}
              <div
                className="overflow-hidden shrink-0"
                style={{ width: isMobile ? '100%' : pageWidth }}
              >
                <div
                  ref={scrollRef}
                  className="flex overflow-x-auto overflow-y-hidden hide-scrollbar snap-x snap-mandatory"
                  style={{
                    WebkitOverflowScrolling: 'touch',
                    gap: 0,
                  }}
                  aria-label="Scrollable review cards"
                >
                  {reviewPages.map((pageReviews, pageIndex) => (
                    <div
                      key={pageIndex}
                      className="flex shrink-0 snap-start justify-center"
                      style={{
                        width: isMobile ? '100%' : pageWidth,
                        gap: CARD_GAP,
                      }}
                    >
                      {pageReviews.map((review) => (
                        <div key={review.id} className="shrink-0" style={{ width: cardWidth }}>
                          <ReviewCard
                            imageSrc={review.imageSrc}
                            imageAlt={review.imageAlt}
                            reviewText={review.reviewText}
                            rating={review.rating}
                            reviewerName={review.reviewerName}
                            verified={review.verified}
                            productVariant={review.productVariant}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              {!isMobile ? (
                <button
                  type="button"
                  onClick={() => scroll('right')}
                  className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#c4a77d] bg-[#c4a77d] text-[#2c1810] shadow-md hover:bg-[#b8956a] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c4a77d] focus-visible:ring-offset-2"
                  aria-label="Next 5 reviews"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : null}
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {!isLoading && displayReviews.length > 0 ? (
            <button
              type="button"
              onClick={() => setViewAllOpen(true)}
              className="w-40 rounded-md bg-[#c4a77d] px-8 py-2.5 text-sm font-bold uppercase tracking-wide text-[#2c1810] hover:bg-[#b8956a] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c4a77d] focus-visible:ring-offset-2 sm:w-auto"
            >
              View all
            </button>
          ) : null}
          <button
            type="button"
            onClick={handleAddReviewClick}
            className="w-40 rounded-md border-2 border-[#c4a77d] bg-white px-8 py-2.5 text-sm font-bold uppercase tracking-wide text-[#2c1810] hover:bg-[#c4a77d]/15 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c4a77d] focus-visible:ring-offset-2 sm:w-auto"
          >
            Add review
          </button>
        </div>
      </div>
    </section>
  );
}
