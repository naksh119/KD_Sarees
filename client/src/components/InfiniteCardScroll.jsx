/**
 * Horizontal infinite card scroll – user can drag/slide; content loops seamlessly.
 * No auto-scroll: position only changes when the user scrolls.
 */

import { useRef, useEffect, useLayoutEffect, useCallback } from 'react';

const GAP_PX = 16; // gap-4 between sets

export default function InfiniteCardScroll({ items, renderItem, cardClassName = '' }) {
  const containerRef = useRef(null);
  const setRef = useRef(null);
  const isJumpingRef = useRef(false);
  const segmentWidthRef = useRef(0);
  const allowJumpRef = useRef(false);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    const segW = segmentWidthRef.current;
    if (!el || !segW || isJumpingRef.current || !allowJumpRef.current) return;

    const { scrollLeft } = el;
    const inset = 0.2;
    if (scrollLeft < segW * inset) {
      isJumpingRef.current = true;
      el.classList.add('snap-none');
      el.scrollLeft += segW;
      requestAnimationFrame(() => {
        el.classList.remove('snap-none');
        isJumpingRef.current = false;
      });
    } else if (scrollLeft > segW * (2 + inset)) {
      isJumpingRef.current = true;
      el.classList.add('snap-none');
      el.scrollLeft -= segW;
      requestAnimationFrame(() => {
        el.classList.remove('snap-none');
        isJumpingRef.current = false;
      });
    }
  }, []);

  useLayoutEffect(() => {
    const el = containerRef.current;
    const setEl = setRef.current;
    if (!el || !setEl) return;

    const setWidth = setEl.offsetWidth;
    segmentWidthRef.current = setWidth + GAP_PX;
    const segW = segmentWidthRef.current;
    // Set initial position instantly (no animation) so user doesn't see any auto-scroll
    el.scrollTo({ left: segW, behavior: 'auto' });
  }, [items?.length]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // Only allow jump logic after user has had a chance to scroll (avoids any programmatic scroll triggering jump)
    const t = setTimeout(() => {
      allowJumpRef.current = true;
    }, 400);
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(t);
      el.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll, items?.length]);

  if (!items?.length) return null;

  const cardWrapperClass = `shrink-0 w-[260px] sm:w-[280px] lg:w-[300px] snap-start ${cardClassName}`.trim();

  return (
    <div
      ref={containerRef}
      className="flex overflow-x-auto overflow-y-hidden gap-4 pb-2 snap-x snap-mandatory hide-scrollbar"
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
