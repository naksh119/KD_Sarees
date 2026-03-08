/**
 * Footer bottom bar: trending search terms (pipe-separated).
 */

const TRENDING_TERMS = [
  'Sudathi Gold',
  'Sarees Saturday',
  'Silk Saree Sale',
  'Shark Tank Sarees Sale',
  'Bestseller Saree Sale',
  'Summer Saree Sale',
  'Monsoon Sale',
  'Festive Sarees Sale',
  'Rakshabandhan Sale',
  'Ganesh Chaturthi Sale',
  'Republic Day Sale',
  'Year End Sale',
  'Makar Sankranti Sale',
  'Onam Sarees Sale',
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
