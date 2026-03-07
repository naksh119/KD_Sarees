/**
 * TOP CATEGORIES section – uses CategoryCard for each category.
 * When section scrolls into view, card images shrink with smooth transition.
 */

import { useState, useRef, useEffect } from 'react';
import CategoryCard from './CategoryCard';

const DEFAULT_CATEGORIES = [
  { imageSrc: 'https://picsum.photos/seed/sarees1/400/533', categoryName: 'SAREES', href: '#' },
  { imageSrc: 'https://picsum.photos/seed/blouse1/400/533', categoryName: 'BLOUSE', href: '#' },
  { imageSrc: 'https://picsum.photos/seed/shapewear1/400/533', categoryName: 'SHAPEWEAR', href: '#' },
  {
    imageSrc: 'https://picsum.photos/seed/sarees-sat/400/533',
    categoryName: 'SAREES SATURDAY',
    overlayText: 'Sarees Saturday',
    href: '#',
  },
];

export default function TopCategories({ categories = DEFAULT_CATEGORIES }) {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.15, rootMargin: '0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-slate-100 py-12 md:py-16"
      aria-labelledby="top-categories-heading"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <h2
          id="top-categories-heading"
          className="text-center text-2xl font-bold uppercase tracking-wider text-slate-800 md:text-3xl"
        >
          Top Categories
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-8">
          {categories.map((cat, index) => (
            <CategoryCard
              key={cat.categoryName}
              imageSrc={cat.imageSrc}
              imageAlt={cat.imageAlt}
              categoryName={cat.categoryName}
              overlayText={cat.overlayText}
              href={cat.href}
              inView={inView}
              animationDelay={index * 80}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
