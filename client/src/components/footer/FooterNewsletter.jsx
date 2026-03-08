/**
 * Footer newsletter: email input, submit button, "Get Updates" text, social icons.
 */

import { useState } from 'react';
import { FaFacebookF, FaPinterestP, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';

const SOCIAL_LINKS = [
  { Icon: FaFacebookF, href: '#', label: 'Facebook' },
  { Icon: FaPinterestP, href: '#', label: 'Pinterest' },
  { Icon: FaInstagram, href: '#', label: 'Instagram' },
  { Icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
  { Icon: FaYoutube, href: '#', label: 'YouTube' },
];

export default function FooterNewsletter() {
  const [email, setEmail] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (email.trim()) {
      // TODO: wire to newsletter API
      setEmail('');
    }
  }

  return (
    <div className="flex flex-col">
      <h3 className="text-sm font-bold uppercase tracking-wide text-white/95">
        Subscribe Our Newsletter
      </h3>
      <form onSubmit={handleSubmit} className="mt-4 flex">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email here"
          className="flex-1 rounded-l border border-white/30 bg-white/10 px-3 py-2.5 text-sm text-white placeholder-white/50 focus:border-white/60 focus:outline-none focus:ring-1 focus:ring-white/40"
          aria-label="Email for newsletter"
        />
        <button
          type="submit"
          className="rounded-r border border-l-0 border-white/30 bg-white/15 px-4 py-2.5 text-white hover:bg-white/25 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Subscribe"
        >
          →
        </button>
      </form>
      <p className="mt-2 text-xs text-white/70">
        Get Updates About Latest Offers
      </p>
      <div className="mt-4 flex items-center gap-3" role="list" aria-label="Social media">
        {SOCIAL_LINKS.map(({ Icon, href, label }) => (
          <a
            key={label}
            href={href}
            className="text-white/80 hover:text-white transition-colors"
            aria-label={label}
          >
            <Icon className="h-5 w-5" />
          </a>
        ))}
      </div>
    </div>
  );
}
