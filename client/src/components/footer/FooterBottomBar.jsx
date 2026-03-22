/**
 * Footer bottom bar: quick links to categories and shop pages (pipe-separated).
 */

import { Link } from 'react-router-dom';
import { CATEGORY_ROUTES, PATHS } from '../../siteLinks';

const TRENDING_LINKS = [
  ...CATEGORY_ROUTES.map(({ slug, label }) => ({
    label,
    to: PATHS.category(slug),
  })),
  { label: 'New Arrivals', to: PATHS.newArrivals },
  { label: 'Best Sellers', to: PATHS.bestSellers },
];

export default function FooterBottomBar() {
  return (
    <div className="border-t border-white/20 py-6">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-white/75">
        {TRENDING_LINKS.map((item, i) => (
          <span key={`${item.to}-${item.label}`}>
            <Link to={item.to} className="hover:text-white transition-colors">
              {item.label}
            </Link>
            {i < TRENDING_LINKS.length - 1 && (
              <span className="mx-2 text-white/50" aria-hidden="true">|</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
