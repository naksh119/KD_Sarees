/**
 * GudiPadwaHero – Promo banner with “Gudi Padwa” headline, price, and hero image.
 * Image: src/assets/images/Wedding-sarees-Hero-_-Espot-V2.png
 */

import heroImage from '../assets/images/Wedding-sarees-Hero-_-Espot-V2.png';

const SHOP_LINK = '#collection';

export default function GudiPadwaHero() {
  return (
    <section
      className="relative overflow-hidden bg-[#2c1810]"
      aria-label="Gudi Padwa – Sarees from ₹899"
    >
      {/* TRENDING NOW strip */}
      <div className="bg-white py-3 text-center md:py-6 px-3">
        <span
          className="text-xl font-bold uppercase tracking-wider text-[#0f172a] sm:text-2xl md:text-3xl"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Trending Now
        </span>
      </div>

      {/* Main banner: gradient left + image right */}
      <div className="relative min-h-[60vmin] sm:min-h-[400px] md:min-h-[450px] lg:min-h-[530px] flex">
        {/* Background image – right side / full bleed */}
        <img
          src={heroImage}
          alt="Traditional saree – Gudi Padwa collection"
          className="absolute inset-0 h-full w-full object-cover object-[65%_center] sm:object-[center_right] md:object-[70%_center]"
          fetchPriority="high"
        />

        {/* Dark gradient overlay from left for text readability – stronger on mobile */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#2c1810] via-[#2c1810]/90 via-[55%] sm:via-[#2c1810]/85 sm:via-50% md:via-45% to-transparent"
          aria-hidden
        />

        {/* Left content – responsive padding and width */}
        <div className="relative z-10 flex min-w-0 flex-col justify-center px-4 py-6 pl-6 pr-4 sm:pl-10 sm:pr-5 sm:py-8 md:pl-24 md:pr-10 md:py-12 w-full max-w-[95%] sm:max-w-[55%] md:max-w-[48%] lg:max-w-[42%]">
          <h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal text-[#f5d76e] leading-tight tracking-normal normal-case break-words"
            style={{ fontFamily: "'Great Vibes', cursive" }}
          >
            Gudi Padwa
          </h2>
          <p
            className="mt-3 text-white text-base font-medium sm:text-lg md:text-xl"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Sarees from ₹899/-
          </p>
          <a
            href={SHOP_LINK}
            className="mt-6 inline-flex items-center justify-center rounded-md bg-[#c4a77d] px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-[#2c1810] hover:bg-[#b8956a] focus:outline-none focus:ring-2 focus:ring-[#c4a77d] focus:ring-offset-2 focus:ring-offset-[#2c1810] transition-colors w-fit"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Shop Now
          </a>
        </div>
      </div>
    </section>
  );
}
