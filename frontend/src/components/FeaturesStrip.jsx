/**
 * FeaturesStrip – Infinite scrolling strip with trust/feature icons.
 * Repeats: Free Shipping, Easy Returns, 3,000+ Styles, Genuine Quality.
 */

const ICON_COLOR = '#38bdf8'; // light blue outline
const ITEM_MIN_WIDTH = '10rem'; // fixed width per item for even spacing

const ITEMS = [
  {
    label: 'Free Shipping',
    icon: (
      <svg viewBox="0 0 32 32" className="w-10 h-10 flex-shrink-0" fill="none" stroke={ICON_COLOR} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M4 20h20v4H4z" />
        <path d="M24 20h2v4h-2z" />
        <path d="M6 20V10h14l4 10" />
        <path d="M20 10h2l2 6" />
        <path d="M4 14h2M10 14h2M16 14h2" />
      </svg>
    ),
  },
  {
    label: 'Easy Returns',
    icon: (
      <svg viewBox="0 0 32 32" className="w-10 h-10 flex-shrink-0" fill="none" stroke={ICON_COLOR} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M28 16a12 12 0 0 1-20 8.93V28" />
        <path d="M4 16a12 12 0 0 1 20-8.93V4" />
        <path d="M4 16h6V10M28 16h-6v-6" />
        <rect x="12" y="12" width="8" height="8" rx="1" />
      </svg>
    ),
  },
  {
    label: '3,000+ Styles',
    icon: (
      <svg viewBox="0 0 32 32" className="w-10 h-10 flex-shrink-0" fill="none" stroke={ICON_COLOR} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M16 6l5 8-5 10-5-10 5-8z" />
        <path d="M8 12l2-2M24 12l-2-2M8 20l2 2M24 20l-2 2M12 8l-2 2M20 8l2 2M12 24l-2-2M20 24l2-2" />
      </svg>
    ),
  },
  {
    label: 'Genuine Quality',
    icon: (
      <svg viewBox="0 0 32 32" className="w-10 h-10 flex-shrink-0" fill="none" stroke={ICON_COLOR} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M16 4v3M16 25v3M4 16h3M25 16h3M7.05 7.05l2.12 2.12M22.83 22.83l2.12 2.12M7.05 24.95l2.12-2.12M22.83 9.17l2.12-2.12" />
        <path d="M16 10a6 6 0 0 1 0 12 6 6 0 0 1 0-12z" />
        <path d="M13 16l2.5 2.5 4.5-4.5" />
      </svg>
    ),
  },
];

function FeatureItem({ label, icon }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-2 shrink-0"
      style={{ width: ITEM_MIN_WIDTH }}
    >
      {icon}
      <span className="text-sm font-medium text-gray-700 whitespace-nowrap">{label}</span>
    </div>
  );
}

export default function FeaturesStrip() {
  const row = (
    <>
      {ITEMS.map((item) => (
        <FeatureItem key={item.label} label={item.label} icon={item.icon} />
      ))}
    </>
  );

  return (
    <section
      className="relative w-full overflow-hidden bg-white border-y border-gray-100 py-4"
      aria-label="Features: Free Shipping, Easy Returns, Thousands of Styles, Genuine Quality"
    >
      <div className="features-strip-track flex">
        <div className="flex items-center gap-0" style={{ minWidth: 'max-content' }}>
          {row}
        </div>
        <div className="flex items-center gap-0 shrink-0" style={{ minWidth: 'max-content' }} aria-hidden>
          {row}
        </div>
        <div className="flex items-center gap-0 shrink-0" style={{ minWidth: 'max-content' }} aria-hidden>
          {row}
        </div>
      </div>
    </section>
  );
}
