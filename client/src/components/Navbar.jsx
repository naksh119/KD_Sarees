/**
 * Reusable Navbar component (KD SAREES header).
 * Responsive: hamburger + drawer on mobile/tablet, full nav on desktop.
 * Use on any page: import Navbar from '../components/Navbar'; then <Navbar />
 */

import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getFavorites } from '../utils/favorites';
import {
  SITE_EMAIL,
  SITE_PHONE_DISPLAY,
  SITE_PHONE_TEL,
  WHATSAPP_URL,
  primaryNavLinks,
  categoryNavLinks,
  informationLinks,
} from '../siteLinks';

function UserIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function CartIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );
}

function HeartIcon({ className = 'w-5 h-5', filled = false }) {
  return (
    <svg
      className={className}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function MailIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function PhoneIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function WhatsAppGlyph({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function Navbar({ favoritesCount, hasTopTicker = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localFavoritesCount, setLocalFavoritesCount] = useState(0);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const syncFavoritesCount = () => {
      setLocalFavoritesCount(getFavorites().length);
    };

    syncFavoritesCount();
    window.addEventListener('favorites:changed', syncFavoritesCount);
    return () => window.removeEventListener('favorites:changed', syncFavoritesCount);
  }, []);

  const displayFavoritesCount = typeof favoritesCount === 'number' ? favoritesCount : localFavoritesCount;

  const linkClass = (highlight) =>
    `block py-2 text-sm uppercase tracking-wide border-b border-gray-100 last:border-0 lg:border-0 lg:py-0 lg:inline-block lg:whitespace-nowrap font-bold ${highlight ? 'text-red-600' : 'text-gray-800 hover:text-gray-600'}`;

  const handleLogout = () => {
    localStorage.removeItem('kd_sarees_token');
    localStorage.removeItem('kd_sarees_refresh_token');
    localStorage.removeItem('kd_sarees_user');
    closeMobileMenu();
    navigate('/');
  };

  return (
    <>
      <header className={`fixed inset-x-0 ${hasTopTicker ? 'top-8' : 'top-0'} z-50 w-full border-b border-gray-100 bg-white`}>
        <nav className="w-full max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8" aria-label="Main navigation">
        {/* Main bar: logo, desktop nav, icons / mobile menu button */}
        <div className="flex items-center justify-between gap-2 sm:gap-4 py-5 sm:py-6 lg:py-7">
          {/* Logo */}
          <Link
            to="/"
            className="shrink-0 text-[#191970] text-3xl sm:text-4xl lg:text-5xl font-normal tracking-normal normal-case"
            style={{ fontFamily: "'Great Vibes', cursive" }}
          >
            Kd Sarees
          </Link>

          {/* Desktop: two rows of links (hidden on mobile/tablet) */}
          <div
            className="hidden lg:flex flex-1 flex-col gap-2 min-w-0 justify-center px-4 font-bold"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <div className="flex flex-wrap items-center justify-center gap-x-4 xl:gap-x-6 gap-y-1 text-xs xl:text-sm uppercase tracking-wide text-gray-800">
              {primaryNavLinks.map((item) =>
                item.router ? (
                  <Link key={item.label} to={item.to} className="hover:text-gray-600 whitespace-nowrap">
                    {item.label}
                  </Link>
                ) : (
                  <a key={item.label} href={item.href} className="hover:text-gray-600 whitespace-nowrap">
                    {item.label}
                  </a>
                ),
              )}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-4 xl:gap-x-6 gap-y-1 text-xs xl:text-sm uppercase tracking-wide text-gray-800">
              {categoryNavLinks.map((item) =>
                item.router ? (
                  <Link key={item.label} to={item.to} className="hover:text-gray-600 whitespace-nowrap">
                    {item.label}
                  </Link>
                ) : (
                  <a key={item.label} href={item.href} className="hover:text-gray-600 whitespace-nowrap">
                    {item.label}
                  </a>
                ),
              )}
            </div>
          </div>

          {/* Right: contact + utility icons + hamburger (mobile/tablet) */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-5 shrink-0 text-gray-900">
            <div className="hidden sm:flex items-center gap-1.5 lg:gap-2 border-r border-gray-200 pr-2 sm:pr-3 lg:pr-4 mr-0.5">
              <a
                href={`mailto:${SITE_EMAIL}`}
                className="p-1.5 hover:opacity-70 text-gray-800"
                aria-label={`Email ${SITE_EMAIL}`}
                title={SITE_EMAIL}
              >
                <MailIcon />
              </a>
              <a
                href={`tel:${SITE_PHONE_TEL}`}
                className="p-1.5 hover:opacity-70 text-gray-800"
                aria-label={`Call ${SITE_PHONE_DISPLAY}`}
                title={SITE_PHONE_DISPLAY}
              >
                <PhoneIcon />
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 hover:opacity-80 text-[#25D366]"
                aria-label="WhatsApp"
              >
                <WhatsAppGlyph />
              </a>
            </div>
            <Link
              to="/auth"
              state={{ backgroundLocation: location }}
              className="p-1.5 hover:opacity-70 sm:block"
              aria-label="Account"
            >
              <UserIcon />
            </Link>
            <Link
              to="/favorites"
              className="relative hidden p-1.5 text-red-600 hover:opacity-80 sm:block"
              aria-label="Favorites"
            >
              <HeartIcon className="w-5 h-5 text-red-600" filled={displayFavoritesCount > 0} />
              {displayFavoritesCount > 0 && (
                <span className="absolute -right-1 -top-1 min-w-[1.1rem] rounded-full bg-rose-600 px-1 text-[10px] leading-4 text-white text-center">
                  {displayFavoritesCount > 99 ? '99+' : displayFavoritesCount}
                </span>
              )}
            </Link>
            <Link to="/cart" className="p-1.5 hover:opacity-70" aria-label="Cart">
              <CartIcon />
            </Link>
            <button
              type="button"
              className="p-2 lg:hidden hover:bg-gray-100 rounded-md -mr-1"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
            >
              <MenuIcon />
            </button>
          </div>
        </div>

        {/* Mobile/tablet menu overlay + drawer */}
        <div
          className={`fixed inset-x-0 bottom-0 ${hasTopTicker ? 'top-8' : 'top-0'} z-[80] lg:hidden ${
            mobileMenuOpen ? 'visible' : 'invisible'
          }`}
          aria-hidden={!mobileMenuOpen}
        >
          {/* Backdrop */}
          <button
            type="button"
            className="absolute inset-0 bg-black/40 transition-opacity"
            onClick={closeMobileMenu}
            aria-label="Close menu"
          />

          {/* Drawer panel */}
          <div
            className={`absolute top-0 right-0 h-full w-full bg-white shadow-xl flex flex-col transition-transform duration-300 ease-out ${
              mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-100">
              <span
                className="flex-1 min-w-0 pr-2 text-2xl sm:text-3xl leading-none font-normal normal-case tracking-normal text-[#191970] truncate"
                style={{ fontFamily: "'Great Vibes', cursive" }}
              >
                Kd Sarees
              </span>
              <button
                type="button"
                className="shrink-0 p-2 hover:bg-gray-100 rounded-md"
                onClick={closeMobileMenu}
                aria-label="Close menu"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4 font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <div className="px-4 space-y-0">
                <p className="text-xs uppercase tracking-wider text-gray-500 px-1 pb-2 pt-1">Shop</p>
                {primaryNavLinks.map((item) =>
                  item.router ? (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={closeMobileMenu}
                      className={linkClass(false)}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a key={item.label} href={item.href} onClick={closeMobileMenu} className={linkClass(false)}>
                      {item.label}
                    </a>
                  ),
                )}
                <p className="text-xs uppercase tracking-wider text-gray-500 px-1 pb-2 pt-4">Categories</p>
                {categoryNavLinks.map((item) =>
                  item.router ? (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={closeMobileMenu}
                      className={linkClass(false)}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a key={item.label} href={item.href} onClick={closeMobileMenu} className={linkClass(false)}>
                      {item.label}
                    </a>
                  ),
                )}
                <p className="text-xs uppercase tracking-wider text-gray-500 px-1 pb-2 pt-4">Information</p>
                {informationLinks.map(({ label, href, external }) =>
                  external ? (
                    <a
                      key={label}
                      href={href}
                      onClick={closeMobileMenu}
                      className={linkClass(false)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {label}
                    </a>
                  ) : (
                    <Link key={label} to={href} onClick={closeMobileMenu} className={linkClass(false)}>
                      {label}
                    </Link>
                  ),
                )}
                <p className="text-xs uppercase tracking-wider text-gray-500 px-1 pb-2 pt-4">Contact</p>
                <a
                  href={`mailto:${SITE_EMAIL}`}
                  onClick={closeMobileMenu}
                  className={linkClass(false)}
                >
                  {SITE_EMAIL}
                </a>
                <a
                  href={`tel:${SITE_PHONE_TEL}`}
                  onClick={closeMobileMenu}
                  className={linkClass(false)}
                >
                  {SITE_PHONE_DISPLAY}
                </a>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMobileMenu}
                  className={linkClass(false)}
                >
                  WhatsApp
                </a>
              </div>
            </div>
            <div className="border-t border-gray-100 p-4">
              <button
                type="button"
                onClick={handleLogout}
                className="kd-btn-theme-primary w-full rounded-md px-4 py-2.5 text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
        </nav>
      </header>
      <div aria-hidden="true" className="h-[88px] sm:h-[98px] lg:h-[112px]" />
    </>
  );
}
