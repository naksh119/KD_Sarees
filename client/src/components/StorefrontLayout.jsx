/**
 * Standard storefront shell: offer ticker, navbar, main, footer (matches cart / home pattern).
 */

import OfferTicker from './OfferTicker';
import Navbar from './Navbar';
import Footer from './footer/Footer';

export default function StorefrontLayout({ children, favoritesCount = undefined }) {
  return (
    <>
      <OfferTicker />
      <Navbar favoritesCount={favoritesCount} hasTopTicker />
      <main className="min-h-[50vh] bg-stone-50/80">{children}</main>
      <Footer />
    </>
  );
}
