/**
 * PromoCard – Single card for Saree Store section.
 * Full-bleed image with dark bottom overlay and uppercase label (e.g. "Sudathi GOLD", "BESTSELLERS").
 */

export default function PromoCard({ imageSrc, imageAlt, label, href = '#' }) {
  const content = (
    <article className="group block h-full min-h-[120px] w-full overflow-hidden rounded-xl">
      <div className="relative h-full w-full min-h-[120px]">
        <img
          src={imageSrc}
          alt={imageAlt ?? label}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
        {label ? (
          <div
            className="absolute inset-x-0 bottom-0 flex items-end justify-center bg-gradient-to-t from-black/75 via-black/50 to-transparent pt-8 pb-2"
            aria-hidden
          >
            <span className="text-lg font-bold uppercase tracking-wider text-amber-300 sm:text-xl md:text-2xl drop-shadow-md">
              {label}
            </span>
          </div>
        ) : null}
      </div>
    </article>
  );

  if (href) {
    return (
      <a
        href={href}
        className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded-xl"
      >
        {content}
      </a>
    );
  }

  return content;
}
