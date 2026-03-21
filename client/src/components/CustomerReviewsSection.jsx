/**
 * Customer Reviews section – carousel of ReviewCard, View all / Add review modals.
 * User-added reviews persist in localStorage (key: kd_sarees_customer_reviews).
 */

import { useRef, useEffect, useState, useMemo } from 'react';
import ReviewCard from './ReviewCard';
import ReviewSuccessPopup from './ReviewSuccessPopup';
import sareeImage from '../assets/images/saree.webp';
import sareeImage2 from '../assets/images/sareeImage2.webp';
import sareeImage3 from '../assets/images/sareeimage3.jpg';
import sareeImageMain from '../assets/images/sareeImage.webp';

const DEFAULT_REVIEWS = [
  {
    id: '1',
    imageSrc: sareeImage,
    imageAlt: 'Teal green saree',
    reviewText: 'Saree is just beautiful, Love it I ordered for my friend I will buy on...',
    rating: 5,
    reviewerName: 'Shushmita V...',
    verified: true,
    productVariant: 'Teal Green...',
  },
  {
    id: '2',
    imageSrc: sareeImage2,
    imageAlt: 'Dark purple fabric',
    reviewText: 'My Mother liked it so much Fancy but affordable❤️❤️',
    rating: 5,
    reviewerName: 'PARVEJ AKH...',
    verified: true,
    productVariant: 'Black Silk Woven...',
  },
  {
    id: '3',
    imageSrc: sareeImage3,
    imageAlt: 'Dusty pink saree',
    reviewText: 'This pink shade saree is truly perfect for wedding...',
    rating: 5,
    reviewerName: 'Nilanjana Gang...',
    verified: false,
    productVariant: 'Dusty Pink Silk...',
  },
  {
    id: '4',
    imageSrc: sareeImageMain,
    imageAlt: 'Off-white saree',
    reviewText: 'I have purchased this saree for my wife & she like most.',
    rating: 5,
    reviewerName: 'Sachin Kum...',
    verified: true,
    productVariant: 'Holi Off White Line...',
  },
  {
    id: '5',
    imageSrc: sareeImage,
    imageAlt: 'Teal green silk',
    reviewText: 'I am happy to see the real saree after delivery...',
    rating: 5,
    reviewerName: 'simple sim',
    verified: false,
    productVariant: 'Teal Green Silk...',
  },
  {
    id: '6',
    imageSrc: sareeImage2,
    imageAlt: 'Silk saree',
    reviewText: 'Quality and colour exactly as shown. Very happy with the purchase.',
    rating: 5,
    reviewerName: 'Priya S...',
    verified: true,
    productVariant: 'Maroon Silk...',
  },
  {
    id: '7',
    imageSrc: sareeImage3,
    imageAlt: 'Pink silk saree',
    reviewText: 'Perfect for my sister\'s wedding. Everyone asked where I got it from!',
    rating: 5,
    reviewerName: 'Anita R...',
    verified: true,
    productVariant: 'Dusty Pink Silk...',
  },
  {
    id: '8',
    imageSrc: sareeImageMain,
    imageAlt: 'White saree',
    reviewText: 'Fabric is so soft and the border work is stunning. Worth every rupee.',
    rating: 5,
    reviewerName: 'Meera K...',
    verified: true,
    productVariant: 'Off White Line...',
  },
  {
    id: '9',
    imageSrc: sareeImage,
    imageAlt: 'Green saree',
    reviewText: 'Delivered on time. Packaging was excellent. Will order again.',
    rating: 5,
    reviewerName: 'Rekha P...',
    verified: false,
    productVariant: 'Teal Green...',
  },
  {
    id: '10',
    imageSrc: sareeImage2,
    imageAlt: 'Black silk',
    reviewText: 'My mother-in-law loved it. Great gift for occasions.',
    rating: 5,
    reviewerName: 'Sunita M...',
    verified: true,
    productVariant: 'Black Silk Woven...',
  },
  {
    id: '11',
    imageSrc: sareeImage3,
    imageAlt: 'Pink fabric',
    reviewText: 'Colour matches the image. No complaints at all. Highly recommend.',
    rating: 4,
    reviewerName: 'Kavita D...',
    verified: true,
    productVariant: 'Dusty Pink...',
  },
  {
    id: '12',
    imageSrc: sareeImageMain,
    imageAlt: 'Holi saree',
    reviewText: 'Bought for Holi party. Light and comfortable. Beautiful print.',
    rating: 5,
    reviewerName: 'Pooja S...',
    verified: true,
    productVariant: 'Holi Off White...',
  },
  {
    id: '13',
    imageSrc: sareeImage,
    imageAlt: 'Teal saree',
    reviewText: 'First time buying online. Trust this store. Quality is top notch.',
    rating: 5,
    reviewerName: 'Neha G...',
    verified: true,
    productVariant: 'Teal Green Silk...',
  },
  {
    id: '14',
    imageSrc: sareeImage2,
    imageAlt: 'Maroon saree',
    reviewText: 'Exactly as described. Stitching and finish are very good.',
    rating: 5,
    reviewerName: 'Vandana L...',
    verified: false,
    productVariant: 'Maroon Silk...',
  },
  {
    id: '15',
    imageSrc: sareeImage3,
    imageAlt: 'Pink wedding saree',
    reviewText: 'Wore it for my best friend\'s wedding. Got so many compliments!',
    rating: 5,
    reviewerName: 'Divya N...',
    verified: true,
    productVariant: 'Dusty Pink Silk...',
  },
  {
    id: '16',
    imageSrc: sareeImageMain,
    imageAlt: 'White silk',
    reviewText: 'Good value for money. Will definitely buy more sarees from here.',
    rating: 4,
    reviewerName: 'Swati J...',
    verified: true,
    productVariant: 'Off White...',
  },
  {
    id: '17',
    imageSrc: sareeImage,
    imageAlt: 'Green silk',
    reviewText: 'Beautiful embroidery. Perfect for festive season. Thank you!',
    rating: 5,
    reviewerName: 'Preeti B...',
    verified: true,
    productVariant: 'Teal Green...',
  },
  {
    id: '18',
    imageSrc: sareeImage2,
    imageAlt: 'Purple saree',
    reviewText: 'Fast delivery and great packaging. Saree is even better in person.',
    rating: 5,
    reviewerName: 'Ritu T...',
    verified: true,
    productVariant: 'Black Silk...',
  },
  {
    id: '19',
    imageSrc: sareeImage3,
    imageAlt: 'Pink silk',
    reviewText: 'Love the shade of pink. Perfect for summer weddings.',
    rating: 5,
    reviewerName: 'Shalini C...',
    verified: false,
    productVariant: 'Dusty Pink...',
  },
  {
    id: '20',
    imageSrc: sareeImageMain,
    imageAlt: 'White line',
    reviewText: 'Great quality and timely delivery. Customer support was helpful.',
    rating: 5,
    reviewerName: 'Aarti V...',
    verified: true,
    productVariant: 'Holi Off White Line...',
  },
  {
    id: '21',
    imageSrc: sareeImage,
    imageAlt: 'Teal woven',
    reviewText: 'Second purchase from this store. Consistent quality. Happy customer.',
    rating: 5,
    reviewerName: 'Smita H...',
    verified: true,
    productVariant: 'Teal Green Silk...',
  },
  {
    id: '22',
    imageSrc: sareeImage2,
    imageAlt: 'Silk woven',
    reviewText: 'Elegant and classy. My go-to place for silk sarees now.',
    rating: 5,
    reviewerName: 'Geeta R...',
    verified: true,
    productVariant: 'Black Silk Woven...',
  },
  {
    id: '23',
    imageSrc: sareeImage3,
    imageAlt: 'Pink silk saree',
    reviewText: 'Amazing quality! Wore it for engagement. Everyone loved it.',
    rating: 5,
    reviewerName: 'Kiran M...',
    verified: true,
    productVariant: 'Dusty Pink Silk...',
  },
  {
    id: '24',
    imageSrc: sareeImageMain,
    imageAlt: 'White saree',
    reviewText: 'Perfect fit and finish. Will recommend to all my friends.',
    rating: 5,
    reviewerName: 'Lata K...',
    verified: false,
    productVariant: 'Off White Line...',
  },
  {
    id: '25',
    imageSrc: sareeImage,
    imageAlt: 'Teal green',
    reviewText: 'Third order from here. Never disappointed. Keep it up!',
    rating: 5,
    reviewerName: 'Mamta P...',
    verified: true,
    productVariant: 'Teal Green...',
  },
  {
    id: '26',
    imageSrc: sareeImage2,
    imageAlt: 'Black silk',
    reviewText: 'Beautiful design. Good for office parties and family functions.',
    rating: 5,
    reviewerName: 'Nandini S...',
    verified: true,
    productVariant: 'Black Silk Woven...',
  },
  {
    id: '27',
    imageSrc: sareeImage3,
    imageAlt: 'Pink fabric',
    reviewText: 'Soft fabric, comfortable to wear. Delivery was super fast.',
    rating: 4,
    reviewerName: 'Oindrila R...',
    verified: true,
    productVariant: 'Dusty Pink...',
  },
  {
    id: '28',
    imageSrc: sareeImageMain,
    imageAlt: 'Holi collection',
    reviewText: 'Bought two sarees. Both are gorgeous. Very satisfied.',
    rating: 5,
    reviewerName: 'Pallavi D...',
    verified: true,
    productVariant: 'Holi Off White...',
  },
  {
    id: '29',
    imageSrc: sareeImage,
    imageAlt: 'Green silk',
    reviewText: 'Best online purchase for sarees. Quality exceeds expectations.',
    rating: 5,
    reviewerName: 'Queen R...',
    verified: true,
    productVariant: 'Teal Green Silk...',
  },
  {
    id: '30',
    imageSrc: sareeImage2,
    imageAlt: 'Maroon silk',
    reviewText: 'Gift for my daughter. She was so happy. Thank you!',
    rating: 5,
    reviewerName: 'Rashmi A...',
    verified: false,
    productVariant: 'Maroon Silk...',
  },
  {
    id: '31',
    imageSrc: sareeImage3,
    imageAlt: 'Pink wedding',
    reviewText: 'Stunning saree for wedding season. Got many compliments.',
    rating: 5,
    reviewerName: 'Simran L...',
    verified: true,
    productVariant: 'Dusty Pink Silk...',
  },
  {
    id: '32',
    imageSrc: sareeImageMain,
    imageAlt: 'White line',
    reviewText: 'Trusted seller. Packaging was neat. Saree is beautiful.',
    rating: 5,
    reviewerName: 'Tanvi G...',
    verified: true,
    productVariant: 'Holi Off White Line...',
  },
];

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

const STORAGE_KEY = 'kd_sarees_customer_reviews';

function loadUserReviewsFromStorage() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return arr.map((r) => ({
      ...r,
      imageSrc: r.imageSrc || sareeImage,
      verified: false,
      imageAlt: r.imageAlt || 'Your purchase',
    }));
  } catch {
    return [];
  }
}

function saveUserReviewsToStorage(list) {
  const toSave = list.map(({ id, reviewText, rating, reviewerName, productVariant, imageAlt, imageSrc }) => ({
    id,
    reviewText,
    rating,
    reviewerName,
    productVariant: productVariant || '',
    imageAlt: imageAlt || 'Your purchase',
    imageSrc: imageSrc || sareeImage,
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
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
        imageSrc: imageSrc || sareeImage,
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
  reviews = DEFAULT_REVIEWS,
  autoScrollIntervalMs = 4000,
  onAddReview,
}) {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [userReviews, setUserReviews] = useState(loadUserReviewsFromStorage);
  const [viewAllOpen, setViewAllOpen] = useState(false);
  const [addReviewOpen, setAddReviewOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [loginRequiredPopupOpen, setLoginRequiredPopupOpen] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window === 'undefined' ? 1280 : window.innerWidth
  );

  const mergedReviews = useMemo(() => [...reviews, ...userReviews], [reviews, userReviews]);
  const isMobile = viewportWidth < 640;
  const cardsPerPage = isMobile ? 1 : DESKTOP_CARDS_PER_PAGE;
  const cardWidth = isMobile
    ? Math.min(300, Math.max(220, viewportWidth - 88))
    : DESKTOP_CARD_WIDTH;
  const pageWidth = cardsPerPage * cardWidth + (cardsPerPage - 1) * CARD_GAP;
  const reviewPages = useMemo(
    () => chunkReviews(mergedReviews, cardsPerPage),
    [mergedReviews, cardsPerPage]
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
    const newReview = {
      id: `user-${Date.now()}`,
      imageSrc: payload.imageSrc || sareeImage,
      imageAlt: 'Your purchase',
      reviewText: payload.reviewText,
      rating: payload.rating,
      reviewerName: payload.reviewerName,
      verified: false,
      productVariant: payload.productVariant,
    };
    setUserReviews((prev) => {
      const next = [...prev, newReview];
      saveUserReviewsToStorage(next);
      return next;
    });
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
    if (isPaused) return;
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
  }, [isPaused, autoScrollIntervalMs, isMobile, pageWidth]);

  return (
    <section
      className="w-full py-12 md:py-16 bg-slate-50"
      aria-labelledby="customer-reviews-heading"
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
            {mergedReviews.map((review) => (
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

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setViewAllOpen(true)}
            className="w-40 rounded-md bg-[#c4a77d] px-8 py-2.5 text-sm font-bold uppercase tracking-wide text-[#2c1810] hover:bg-[#b8956a] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c4a77d] focus-visible:ring-offset-2 sm:w-auto"
          >
            View all
          </button>
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
