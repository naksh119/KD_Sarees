/**
 * Customer Reviews section – header with aggregate rating + verified badge,
 * horizontal carousel of ReviewCard with left/right arrow navigation.
 * Data passed via props; default sample data included.
 */

import { useRef, useEffect, useState } from 'react';
import ReviewCard from './ReviewCard';
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

const CARD_WIDTH = 160;
const CARD_GAP = 16;
const CARDS_PER_PAGE = 5;
const PAGE_WIDTH = CARDS_PER_PAGE * CARD_WIDTH + (CARDS_PER_PAGE - 1) * CARD_GAP; // 864

function chunkReviews(reviews, size) {
  const chunks = [];
  for (let i = 0; i < reviews.length; i += size) {
    chunks.push(reviews.slice(i, i + size));
  }
  return chunks;
}

export default function CustomerReviewsSection({
  reviews = DEFAULT_REVIEWS,
  autoScrollIntervalMs = 4000,
}) {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const reviewPages = chunkReviews(reviews, CARDS_PER_PAGE);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (direction === 'right') {
      const next = el.scrollLeft + PAGE_WIDTH;
      if (next >= maxScroll) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: PAGE_WIDTH, behavior: 'smooth' });
      }
    } else {
      const prev = el.scrollLeft - PAGE_WIDTH;
      if (prev <= 0) {
        el.scrollTo({ left: maxScroll, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: -PAGE_WIDTH, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      if (!scrollRef.current) return;
      const el = scrollRef.current;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return;
      const next = el.scrollLeft + PAGE_WIDTH;
      if (next >= maxScroll) {
        // Reset to first card when reaching last (instant, then loop continues)
        el.scrollTo({ left: 0, behavior: 'auto' });
      } else {
        el.scrollBy({ left: PAGE_WIDTH, behavior: 'smooth' });
      }
    }, autoScrollIntervalMs);
    return () => clearInterval(id);
  }, [isPaused, autoScrollIntervalMs]);

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

        <div
          className="relative mt-8 flex justify-center overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="relative flex items-center justify-center gap-2 px-2"
            style={{ width: PAGE_WIDTH + 96 }}
          >
            <button
              type="button"
              onClick={() => scroll('left')}
              className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-md hover:bg-slate-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1e3a5f] focus-visible:ring-offset-2"
              aria-label="Previous 5 reviews"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div
              className="overflow-hidden shrink-0"
              style={{ width: PAGE_WIDTH }}
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
                    className="flex shrink-0 snap-start"
                    style={{
                      width: PAGE_WIDTH,
                      gap: CARD_GAP,
                    }}
                  >
                    {pageReviews.map((review) => (
                      <div key={review.id} className="shrink-0" style={{ width: CARD_WIDTH }}>
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
            <button
              type="button"
              onClick={() => scroll('right')}
              className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-md hover:bg-slate-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1e3a5f] focus-visible:ring-offset-2"
              aria-label="Next 5 reviews"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
