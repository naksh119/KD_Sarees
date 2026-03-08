/**
 * Bestseller product grid – same ProductCard as ProductSection.
 * Infinite horizontal scroll: user can slide through cards; content loops.
 */

import ProductCard from './ProductCard';
import InfiniteCardScroll from './InfiniteCardScroll';
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
];

export default function BestsellerSareesSection({
  products = DEFAULT_PRODUCTS,
  viewAllHref = '#',
}) {
  return (
    <section
      className="w-full py-12 md:py-16"
      aria-label="Bestseller sarees"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <InfiniteCardScroll
          items={products}
          renderItem={(product) => (
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
          )}
        />

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
