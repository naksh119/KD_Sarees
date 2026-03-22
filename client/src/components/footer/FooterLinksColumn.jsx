/**
 * Reusable footer column with heading and list of links.
 * Used for Popular Searches, Information, Customer Care.
 */

import { Link } from 'react-router-dom';

function isInternalHref(href, external) {
  return (
    !external &&
    typeof href === 'string' &&
    href.startsWith('/') &&
    !href.startsWith('//')
  );
}

export default function FooterLinksColumn({ title, links }) {
  return (
    <div className="flex flex-col">
      <h3 className="text-sm font-bold uppercase tracking-wide text-white/95">
        {title}
      </h3>
      <ul className="mt-4 space-y-2">
        {links.map((item) => (
          <li key={item.label}>
            {isInternalHref(item.href, item.external) ? (
              <Link
                to={item.href}
                className="text-sm text-white/75 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <a
                href={item.href}
                className="text-sm text-white/75 hover:text-white transition-colors"
                {...(item.external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                {item.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
