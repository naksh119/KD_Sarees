/**
 * Footer bottom bar: trending search terms (pipe-separated).
 */

const TRENDING_TERMS = [
  'Clothing',
  'Gorget',
  'Pethni',
  'Banarsi',
  'Tishu',
  'Ready made blouse',
  'Handwork',
  'New Arrivals',
  'Best Sellers',
];

export default function FooterBottomBar() {
  return (
    <div className="border-t border-white/20 py-6">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-white/75">
        {TRENDING_TERMS.map((term, i) => (
          <span key={term}>
            <a href="#" className="hover:text-white transition-colors">
              {term}
            </a>
            {i < TRENDING_TERMS.length - 1 && (
              <span className="mx-2 text-white/50" aria-hidden="true">|</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
