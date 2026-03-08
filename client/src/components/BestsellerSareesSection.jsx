/**
 * Bestseller product row – same ProductCard, horizontal scroll, max 12 cards, stops at end.
 */

import ProductCard from './ProductCard';
import sareeImage from '../assets/images/saree.webp';
import sareeImage2 from '../assets/images/sareeImage2.webp';
import sareeImage3 from '../assets/images/sareeimage3.jpg';

const DEFAULT_PRODUCTS = [
  {
    id: 'banarasi-maroon',
    imageSrc: sareeImage,
    imageSrcHover: sareeImage2,
    imageAlt: 'Maroon silk woven Banarasi saree',
    productTitle: 'Maroon Silk Woven Banarasi Saree',
    originalPrice: 1924,
    currentPrice: 599,
    discountPercentage: 69,
    rating: 5,
    reviewCount: 2325,
    isSale: true,
    showAddToCartButton: true,
    href: '#',
  },
  {
    id: 'banarasi-green',
    imageSrc: sareeImage,
    imageSrcHover: sareeImage3,
    imageAlt: 'Dark green silk woven Banarasi saree',
    productTitle: 'Dark Green Silk Woven Banarasi Saree',
    originalPrice: 2318,
    currentPrice: 749,
    discountPercentage: 68,
    rating: 5,
    reviewCount: 860,
    isSale: true,
    showAddToCartButton: true,
    href: '#',
  },
  {
    id: 'patola-red',
    imageSrc: sareeImage,
    imageSrcHover: sareeImage2,
    imageAlt: 'Red silk woven Patola saree',
    productTitle: 'Red Silk Woven Patola Saree',
    originalPrice: 2391,
    currentPrice: 899,
    discountPercentage: 62,
    rating: 5,
    reviewCount: 156,
    isSale: true,
    showAddToCartButton: true,
    href: '#',
  },
  {
    id: 'swarovski-sapphire',
    imageSrc: sareeImage,
    imageSrcHover: sareeImage3,
    imageAlt: 'Shweta Tiwari sapphire blue Swarovski saree',
    productTitle: 'Shweta Tiwari Sapphire Blue Swarovski Saree',
    originalPrice: 4203,
    currentPrice: 1699,
    discountPercentage: 60,
    rating: 5,
    reviewCount: 104,
    isSale: true,
    showAddToCartButton: true,
    href: '#',
  },
  {
    id: 'banarasi-pink',
    imageSrc: sareeImage,
    imageSrcHover: sareeImage2,
    imageAlt: 'Pink silk woven Banarasi saree',
    productTitle: 'Pink Silk Woven Banarasi Saree',
    originalPrice: 2100,
    currentPrice: 699,
    discountPercentage: 67,
    rating: 5,
    reviewCount: 412,
    isSale: true,
    showAddToCartButton: true,
    href: '#',
  },
  {
    id: 'banarasi-gold',
    imageSrc: sareeImage,
    imageSrcHover: sareeImage3,
    imageAlt: 'Gold silk woven Banarasi saree',
    productTitle: 'Gold Silk Woven Banarasi Saree',
    originalPrice: 3500,
    currentPrice: 1299,
    discountPercentage: 63,
    rating: 5,
    reviewCount: 289,
    isSale: true,
    showAddToCartButton: true,
    href: '#',
  },
  {
    id: 'patola-blue',
    imageSrc: sareeImage,
    imageSrcHover: sareeImage2,
    imageAlt: 'Blue silk woven Patola saree',
    productTitle: 'Blue Silk Woven Patola Saree',
    originalPrice: 2650,
    currentPrice: 949,
    discountPercentage: 64,
    rating: 5,
    reviewCount: 98,
    isSale: true,
    showAddToCartButton: true,
    href: '#',
  },
  {
    id: 'patola-green',
    imageSrc: sareeImage,
    imageSrcHover: sareeImage3,
    imageAlt: 'Green silk woven Patola saree',
    productTitle: 'Green Silk Woven Patola Saree',
    originalPrice: 2499,
    currentPrice: 849,
    discountPercentage: 66,
    rating: 5,
    reviewCount: 134,
    isSale: true,
    showAddToCartButton: true,
    href: '#',
  },
  {
    id: 'silk-mustard',
    imageSrc: sareeImage,
    imageSrcHover: sareeImage2,
    imageAlt: 'Mustard silk saree',
    productTitle: 'Mustard Silk Woven Banarasi Saree',
    originalPrice: 1899,
    currentPrice: 599,
    discountPercentage: 68,
    rating: 5,
    reviewCount: 567,
    isSale: true,
    showAddToCartButton: true,
    href: '#',
  },
  {
    id: 'silk-burgundy',
    imageSrc: sareeImage,
    imageSrcHover: sareeImage3,
    imageAlt: 'Burgundy silk saree',
    productTitle: 'Burgundy Silk Woven Saree',
    originalPrice: 3200,
    currentPrice: 1199,
    discountPercentage: 63,
    rating: 5,
    reviewCount: 201,
    isSale: true,
    showAddToCartButton: true,
    href: '#',
  },
  {
    id: 'silk-peach',
    imageSrc: sareeImage,
    imageSrcHover: sareeImage2,
    imageAlt: 'Peach silk saree',
    productTitle: 'Peach Silk Woven Saree',
    originalPrice: 2299,
    currentPrice: 799,
    discountPercentage: 65,
    rating: 5,
    reviewCount: 176,
    isSale: true,
    showAddToCartButton: true,
    href: '#',
  },
  {
    id: 'silk-navy',
    imageSrc: sareeImage,
    imageSrcHover: sareeImage3,
    imageAlt: 'Navy blue silk saree',
    productTitle: 'Navy Blue Silk Woven Saree',
    originalPrice: 2799,
    currentPrice: 949,
    discountPercentage: 66,
    rating: 5,
    reviewCount: 143,
    isSale: true,
    showAddToCartButton: true,
    href: '#',
  },
  {
    id: 'silk-coral',
    imageSrc: sareeImage,
    imageSrcHover: sareeImage2,
    imageAlt: 'Coral silk saree',
    productTitle: 'Coral Silk Woven Saree',
    originalPrice: 1999,
    currentPrice: 699,
    discountPercentage: 65,
    rating: 5,
    reviewCount: 89,
    isSale: true,
    showAddToCartButton: true,
    href: '#',
  },
  {
    id: 'silk-ivory',
    imageSrc: sareeImage,
    imageSrcHover: sareeImage3,
    imageAlt: 'Ivory silk saree',
    productTitle: 'Ivory Silk Woven Saree',
    originalPrice: 3100,
    currentPrice: 1099,
    discountPercentage: 65,
    rating: 5,
    reviewCount: 212,
    isSale: true,
    showAddToCartButton: true,
    href: '#',
  },
];

const MAX_CARDS = 15;

export default function BestsellerSareesSection({
  products = DEFAULT_PRODUCTS,
  viewAllHref = '#',
}) {
  const displayProducts = products.slice(0, MAX_CARDS);

  return (
    <section
      className="w-full py-12 md:py-16"
      aria-label="Bestseller sarees"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div
          className="flex overflow-x-auto overflow-y-hidden gap-4 pb-2 snap-x snap-mandatory hide-scrollbar"
          style={{ WebkitOverflowScrolling: 'touch' }}
          aria-label="Scrollable product cards"
        >
          {displayProducts.map((product) => (
            <div
              key={product.id}
              className="shrink-0 w-[260px] sm:w-[280px] lg:w-[300px] snap-start"
            >
              <ProductCard
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
              />
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href={viewAllHref}
            className="rounded-md bg-[#c4a77d] px-14 py-3 text-base font-bold uppercase tracking-wide text-[#2c1810] hover:bg-[#b8956a] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c4a77d] focus-visible:ring-offset-2"
          >
            View all
          </a>
        </div>
      </div>
    </section>
  );
}
