/**
 * SareeStoreSection – Hero-style section with title "THE SAREE STORE" and a 3-column
 * grid of promotional cards: left (tall), center (2 stacked), right (tall).
 */

import PromoCard from './PromoCard';
import sareeImage from '../assets/images/saree.webp';
import cornerCardImage from '../assets/images/sareeImage.webp';
import rightCornerImage from '../assets/images/sareeImage2.webp';
import centerCardImage from '../assets/images/sareeimage3.jpg';

const DEFAULT_PROMOS = [
  {
    imageSrc: cornerCardImage,
    imageAlt: 'Sudathi Gold collection',
    label: '',
    href: '#',
  },
  {
    imageSrc: centerCardImage,
    imageAlt: 'Bestseller sarees',
    label: '',
    href: '#',
  },
  {
    imageSrc: centerCardImage,
    imageAlt: 'Essential sarees',
    label: '',
    href: '#',
  },
  {
    imageSrc: rightCornerImage,
    imageAlt: 'Ready to wear sarees',
    label: '',
    href: '#',
  },
];

export default function SareeStoreSection({ promos = DEFAULT_PROMOS }) {
  const [left, bestsellers, essentials, right] = promos;

  return (
    <section
      className="w-full py-4 md:py-6"
      aria-labelledby="saree-store-heading"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <h2
          id="saree-store-heading"
          className="text-center text-2xl font-bold uppercase tracking-wider text-slate-800 md:text-3xl"
        >
          The Saree Store
        </h2>

        {/* Grid: center column narrower (1fr), corners 0.75fr each */}
        <div className="mt-4 grid grid-cols-1 gap-2 sm:gap-3 lg:aspect-[5/2] lg:grid-cols-[0.75fr_1fr_0.75fr] lg:grid-rows-2 lg:gap-4 lg:items-stretch lg:w-full">
          {/* Left – tall card, spans 2 rows; extra space from center */}
          <div className="min-h-[140px] sm:min-h-[160px] lg:min-h-0 lg:row-span-2 lg:mr-8">
            <PromoCard
              imageSrc={left?.imageSrc ?? sareeImage}
              imageAlt={left?.imageAlt}
              label={left?.label ?? ''}
              href={left?.href}
            />
          </div>

          {/* Center – two equal-height cards (1:1 each), spans 2 rows */}
          <div className="flex flex-col gap-2 sm:gap-3 lg:row-span-2 lg:min-h-0 lg:gap-4">
            <div className="min-h-[120px] flex-1 lg:min-h-0">
              <PromoCard
                imageSrc={bestsellers?.imageSrc ?? sareeImage}
                imageAlt={bestsellers?.imageAlt}
                label={bestsellers?.label ?? ''}
                href={bestsellers?.href}
              />
            </div>
            <div className="min-h-[120px] flex-1 lg:min-h-0">
              <PromoCard
                imageSrc={essentials?.imageSrc ?? sareeImage}
                imageAlt={essentials?.imageAlt}
                label={essentials?.label ?? ''}
                href={essentials?.href}
              />
            </div>
          </div>

          {/* Right – tall card, spans 2 rows; extra space from center */}
          <div className="min-h-[140px] sm:min-h-[160px] lg:min-h-0 lg:row-span-2 lg:ml-8">
            <PromoCard
              imageSrc={right?.imageSrc ?? sareeImage}
              imageAlt={right?.imageAlt}
              label={right?.label ?? ''}
              href={right?.href}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
