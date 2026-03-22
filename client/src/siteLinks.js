/**
 * Shared navigation and footer links for KD Sarees.
 * Update email / phone here to keep navbar and footer in sync.
 */

export const SITE_EMAIL = 'support@kdsarees.com';
export const SITE_PHONE_DISPLAY = '+91 9685187167';
export const SITE_PHONE_TEL = '919685187167';

export const WHATSAPP_URL =
  'https://api.whatsapp.com/send/?phone=919685187167&text=Hello%21+I+am+interested+in+your+product';

/** Slugs must match Category.slug in admin when filtering products. */
export const CATEGORY_ROUTES = [
  { slug: 'clothing', label: 'Clothing' },
  { slug: 'gorget', label: 'Gorget' },
  { slug: 'pethni', label: 'Pethni' },
  { slug: 'banarsi', label: 'Banarsi' },
  { slug: 'tishu', label: 'Tishu' },
  { slug: 'ready-made-blouse', label: 'Ready made blouse' },
  { slug: 'handwork', label: 'Handwork' },
];

export const PATHS = {
  home: '/',
  newArrivals: '/new-arrivals',
  bestSellers: '/best-sellers',
  contact: '/contact',
  noReturnExchange: '/no-return-exchange',
  category: (slug) => `/category/${slug}`,
};

export const primaryNavLinks = [
  { label: 'Home', to: PATHS.home, router: true },
  { label: 'New Arrivals', to: PATHS.newArrivals, router: true },
  { label: 'Best Sellers', to: PATHS.bestSellers, router: true },
];

export const categoryNavLinks = CATEGORY_ROUTES.map(({ slug, label }) => {
  const to = PATHS.category(slug);
  return {
    label,
    href: to,
    to,
    router: true,
  };
});

export const informationLinks = [
  { label: 'Contact us', href: PATHS.contact },
  { label: 'No return & exchange', href: PATHS.noReturnExchange },
  { label: 'WhatsApp', href: WHATSAPP_URL, external: true },
];

export function getCategoryLabelForSlug(slug) {
  return CATEGORY_ROUTES.find((c) => c.slug === slug)?.label ?? slug;
}
