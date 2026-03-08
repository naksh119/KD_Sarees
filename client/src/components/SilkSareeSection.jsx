/**
 * SilkSareeSection – Full-width clickable banner using Silk_Saree_desktop.webp.
 * Whole section is clickable; navigation to be added later.
 */

import silkSareeDesktop from '../assets/images/Silk_Saree_desktop.webp';

export default function SilkSareeSection() {
  const handleClick = () => {
    // TODO: Add navigation to target page when routing is set up
  };

  return (
    <section
      className="w-full py-4 md:py-6"
      aria-label="Silk Saree collection"
    >
      <button
        type="button"
        onClick={handleClick}
        className="block w-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
      >
        <img
          src={silkSareeDesktop}
          alt="Silk Saree collection"
          className="h-auto w-full object-cover object-center"
        />
      </button>
    </section>
  );
}
