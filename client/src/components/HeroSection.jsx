/**
 * HeroSection – Full-bleed hero banner with left-side text overlay.
 * Image path: src/assets/images/hero_section_image.webp
 */

import heroImage from '../assets/images/hero_section_image.webp';

const SHOP_LINK = '#collection';

export default function HeroSection() {
  return (
    <section
      className="relative min-h-[540px] md:min-h-[630px] overflow-hidden bg-stone-200"
      aria-label="KD Sarees – Summer in Florals"
    >
      <img
        src={heroImage}
        alt="Elegant saree showcase – KD Sarees collection"
        className="absolute inset-0 h-full w-full object-cover object-center"
        fetchPriority="high"
      />

      {/* Left-side overlay for readability */}
      <div
        className="absolute inset-0 md:max-w-[55%] bg-gradient-to-r from-black/50 via-black/25 to-transparent"
        aria-hidden
      />

      {/* Text overlay – left side, vertically centered */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center px-6 py-12 md:px-12 md:py-16 md:max-w-[50%]">
        <h2
          className="text-4xl md:text-5xl lg:text-6xl font-normal italic text-black tracking-wide"
          style={{ fontFamily: "'Great Vibes', cursive" }}
        >
          Summer in Florals
        </h2>
        <p
          className="mt-4 text-white/95 text-lg md:text-xl font-normal leading-relaxed pl-2 md:pl-4"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Woven with lightness,
          <br />
          Sheer & Radiant
        </p>
        <a
          href={SHOP_LINK}
          className="mt-8 inline-flex items-center justify-center rounded-md bg-transparent px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white border-2 border-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent transition-colors w-fit"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Shop now
        </a>
      </div>
    </section>
  );
}
