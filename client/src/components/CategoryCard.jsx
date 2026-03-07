/**
 * Reusable category card for TOP CATEGORIES section.
 * When inView is false (section not in viewport), image fills full card; when inView is true, image shrinks to inset size with smooth transition.
 */

export default function CategoryCard({
  imageSrc,
  imageAlt,
  categoryName,
  overlayText,
  href = '#',
  inView = false,
  animationDelay = 0,
}) {
  const content = (
    <article className="category-card group block w-full overflow-hidden rounded-xl text-center">
      <div className="category-card__frame rounded-xl p-[3px] bg-gradient-to-br from-cyan-200/90 to-teal-300/80 shadow-inner">
        <div className="rounded-[10px] bg-[#0f172a] p-3 pt-4 pb-0">
          {/* Image: full width until section in view, then shrinks to 92% with smooth transition */}
          <div className="flex justify-center">
            <div
              className="category-card__image-wrap relative aspect-[2/3] overflow-hidden rounded-lg border-2 border-amber-400/90 bg-slate-800 shrink-0"
              style={{
                width: inView ? '92%' : '100%',
                transition: `width 0.6s ease-out ${animationDelay}ms`
              }}
            >
              <img
                src={imageSrc}
                alt={imageAlt ?? categoryName}
                className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
              />
              {overlayText && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/20"
                  aria-hidden
                >
                  <span className="font-serif text-xl sm:text-2xl font-medium tracking-wide text-white drop-shadow-md italic">
                    {overlayText}
                  </span>
                </div>
              )}
            </div>
          </div>
          {/* Bottom text: start mein invisible; jab card chota ho to transparent se dark aata hua */}
          <div
            className="category-card__label flex items-center justify-center px-3 overflow-hidden"
            style={{
              opacity: inView ? 1 : 0,
              backgroundColor: inView ? '#0f172a' : 'transparent',
              marginTop: inView ? 8 : 0,
              minHeight: inView ? 52 : 0,
              maxHeight: inView ? 100 : 0,
              paddingTop: inView ? 8 : 0,
              paddingBottom: inView ? 8 : 0,
              transition: `opacity 0.5s ease-out ${animationDelay + 150}ms, background-color 0.5s ease-out ${animationDelay + 150}ms, margin-top 0.4s ease-out ${animationDelay + 200}ms, min-height 0.4s ease-out ${animationDelay + 200}ms, max-height 0.4s ease-out ${animationDelay + 200}ms, padding 0.4s ease-out ${animationDelay + 200}ms`
            }}
          >
            <span className="text-sm font-bold uppercase tracking-wider text-white sm:text-base whitespace-nowrap">
              {categoryName}
            </span>
          </div>
        </div>
      </div>
    </article>
  );

  if (href) {
    return (
      <a
        href={href}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded-xl"
      >
        {content}
      </a>
    );
  }

  return content;
}
