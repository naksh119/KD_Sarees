/**
 * Horizontal infinite card scroll – user can drag/slide; content loops seamlessly.
 * Uses scroll-snap and three copies of content with scroll-position reset for infinite effect.
 */

import { useRef, useEffect, useCallback } from 'react';

export default function InfiniteCardScroll({ items, renderItem, cardClassName = '' }) {
  const containerRef = useRef(null);
  const setRef = useRef(null);
  const isJumpingRef = useRef(false);

  const setWidthRef = useRef(0);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    const setWidth = setWidthRef.current;
    if (!el || !setWidth || isJumpingRef.current) return;

    const { scrollLeft } = el;
    // Only jump when we're well INSIDE the duplicate set, so after jump we stay at same visual position (no snap to first card)
    const inset = 0.15; // jump only after 15% into Set0 or Set2
    if (scrollLeft < setWidth * inset) {
      // Deep in Set0 → jump to same position in Set1
      isJumpingRef.current = true;
      el.scrollLeft += setWidth;
      requestAnimationFrame(() => {
        isJumpingRef.current = false;
      });
    } else if (scrollLeft > setWidth * (2 + inset)) {
      // Deep in Set2 → jump to same position in Set1
      isJumpingRef.current = true;
      el.scrollLeft -= setWidth;
      requestAnimationFrame(() => {
        isJumpingRef.current = false;
      });
    }
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    const setEl = setRef.current;
    if (!el || !setEl) return;

    const setWidth = setEl.offsetWidth;
    setWidthRef.current = setWidth;
    // Start in the middle set after layout so user can scroll both ways
    const raf = requestAnimationFrame(() => {
      if (setWidthRef.current) el.scrollLeft = setWidthRef.current;
    });

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll, items?.length]);

  if (!items?.length) return null;

  const cardWrapperClass = `shrink-0 w-[260px] sm:w-[280px] lg:w-[300px] snap-start ${cardClassName}`.trim();

  return (
    <div
      ref={containerRef}
      className="flex overflow-x-auto overflow-y-hidden gap-4 pb-2 snap-x snap-mandatory scroll-smooth hide-scrollbar"
      style={{ WebkitOverflowScrolling: 'touch' }}
      aria-label="Scrollable product cards"
    >
      {[0, 1, 2].map((setIndex) => (
        <div
          key={setIndex}
          ref={setIndex === 0 ? setRef : null}
          className="flex shrink-0 gap-4 pr-4"
        >
          {items.map((item, index) => (
            <div key={`${setIndex}-${item.id ?? index}`} className={cardWrapperClass}>
              {renderItem(item)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
