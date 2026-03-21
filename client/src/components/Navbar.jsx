/**
 * Reusable Navbar component (KD SAREES header).
 * Responsive: hamburger + drawer on mobile/tablet, full nav on desktop.
 * Use on any page: import Navbar from '../components/Navbar'; then <Navbar />
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';

const topLinks = [
  { label: 'SAREE', href: '#' },
  { label: 'ESSENTIALS', href: '#' },
  { label: 'READY TO WEAR SAREES', href: '#' },
  { label: 'COLLECTIONS', href: '#' },
  { label: 'SUDATHI GOLD', href: '#' },
  { label: 'SILK SAREE SALE', href: '#' },
  { label: 'INDIAN HERITAGE', href: '#' },
];

const bottomLinks = [
  { label: 'SAREES SATURDAY', href: '#' },
  { label: 'CELEBRITY SAREES', href: '#' },
  { label: 'SALE', href: '#', highlight: true },
  { label: 'SHARK TANK', href: '#' },
  { label: 'HOLI', href: '#' },
];

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

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const linkClass = (highlight) =>
    `block py-2 text-sm uppercase tracking-wide border-b border-gray-100 last:border-0 lg:border-0 lg:py-0 lg:inline-block lg:whitespace-nowrap font-bold ${highlight ? 'text-red-600' : 'text-gray-800 hover:text-gray-600'}`;

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-8 z-50">
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
              {topLinks.map(({ label, href }) => (
                <a key={label} href={href} className="hover:text-gray-600 whitespace-nowrap">
                  {label}
                </a>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-4 xl:gap-x-6 gap-y-1 text-xs xl:text-sm uppercase tracking-wide text-gray-800">
              {bottomLinks.map(({ label, href, highlight }) => (
                <a
                  key={label}
                  href={href}
                  className={`whitespace-nowrap ${highlight ? 'text-red-600' : 'hover:text-gray-600'}`}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Right: utility icons (desktop) + hamburger (mobile/tablet) */}
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 shrink-0 text-gray-900">
            <Link to="/auth" className="p-1.5 hover:opacity-70 sm:block" aria-label="Account">
              <UserIcon />
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
          className={`fixed inset-0 z-50 lg:hidden ${mobileMenuOpen ? 'visible' : 'invisible'}`}
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
            className={`absolute top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl flex flex-col transition-transform duration-300 ease-out ${
              mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <span
                className="text-3xl font-normal normal-case tracking-normal text-[#191970]"
                style={{ fontFamily: "'Great Vibes', cursive" }}
              >
                Kd Sarees
              </span>
              <button
                type="button"
                className="p-2 hover:bg-gray-100 rounded-md"
                onClick={closeMobileMenu}
                aria-label="Close menu"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4 font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <div className="px-4 space-y-0">
                <p className="text-xs uppercase tracking-wider text-gray-500 px-1 pb-2 pt-1">Shop</p>
                {topLinks.map(({ label, href }) => (
                  <a key={label} href={href} onClick={closeMobileMenu} className={linkClass(false)}>
                    {label}
                  </a>
                ))}
                {bottomLinks.map(({ label, href, highlight }) => (
                  <a
                    key={label}
                    href={href}
                    onClick={closeMobileMenu}
                    className={linkClass(highlight)}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
