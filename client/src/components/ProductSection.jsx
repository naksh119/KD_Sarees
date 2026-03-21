/**
 * Product grid section – uses ProductCard with data passed via props.
 * Includes VIEW ALL CTA. Supports hover image swap via imageSrcHover.
 */

import ProductCard from './ProductCard';
import sareeImage from '../assets/images/saree.webp';
import sareeImage2 from '../assets/images/sareeImage2.webp';
import sareeImage3 from '../assets/images/sareeimage3.jpg';

const DEFAULT_PRODUCTS = [
  {
    id: '1',
    imageSrc: sareeImage,
    imageSrcHover: sareeImage2,
    imageAlt: 'Red silk woven Paithani saree',
    productTitle: 'Red Silk Woven Paithani Saree',
    originalPrice: 2791,
    currentPrice: 999,
    discountPercentage: 64,
    rating: 4,
    reviewCount: 22,
    isSale: true,
    showAddToCartButton: true,
    href: '#',
  },
  {
    id: '2',
    imageSrc: sareeImage,
    imageSrcHover: sareeImage3,
    imageAlt: 'Mint green silk woven Paithani saree',
    productTitle: 'Mint Green Silk Woven Paithani Saree',
    originalPrice: 4782,
    currentPrice: 1599,
    discountPercentage: 67,
    rating: 4.5,
    reviewCount: 7,
    isSale: false,
    showAddToCartButton: true,
    href: '#',
  },
  {
    id: '3',
    imageSrc: sareeImage,
    imageSrcHover: sareeImage2,
    imageAlt: 'Lime green silk woven Paithani saree',
    productTitle: 'Lime Green Silk Woven Paithani Saree',
    originalPrice: 4112,
    currentPrice: 1099,
    discountPercentage: 73,
    rating: 4,
    reviewCount: 6,
    isSale: true,
    showAddToCartButton: true,
    href: '#',
  },
  {
    id: '4',
    imageSrc: sareeImage,
    imageSrcHover: sareeImage3,
    imageAlt: 'Black silk woven Paithani saree',
    productTitle: 'Black Silk Woven Paithani Saree',
    originalPrice: 3256,
    currentPrice: 999,
    discountPercentage: 69,
    rating: 4,
    reviewCount: 24,
    isSale: false,
    showAddToCartButton: true,
    href: '#',
  },
];

export default function ProductSection({ products = DEFAULT_PRODUCTS, viewAllHref = '#', onAddToCart }) {
  return (
    <section
      className="w-full py-12 md:py-16"
      aria-labelledby="product-section-heading"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <h2
          id="product-section-heading"
          className="text-center text-2xl font-bold uppercase tracking-wider text-slate-800 md:text-3xl"
        >
          Featured Products
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
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
            />
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
