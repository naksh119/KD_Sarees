/**
 * Shared navigation and footer links for KD Sarees.
 * Update email / phone here to keep navbar and footer in sync.
 */

export const SITE_EMAIL = 'support@kdsarees.com';
export const SITE_PHONE_DISPLAY = '+91 9685187167';
export const SITE_PHONE_TEL = '919685187167';

export const WHATSAPP_URL =
  'https://api.whatsapp.com/send/?phone=919685187167&text=Hello%21+I+am+interested+in+your+product';

export const primaryNavLinks = [
  { label: 'Home', to: '/', router: true },
  { label: 'New Arrivals', href: '/#new-arrivals' },
  { label: 'Best Sellers', href: '/#best-sellers' },
];

export const categoryNavLinks = [
  { label: 'Clothing', href: '#' },
  { label: 'Gorget', href: '#' },
  { label: 'Pethni', href: '#' },
  { label: 'Banarsi', href: '#' },
  { label: 'Tishu', href: '#' },
  { label: 'Ready made blouse', href: '#' },
  { label: 'Handwork', href: '#' },
];

export const informationLinks = [
  { label: 'Contact us', href: '#' },
  { label: 'No return & exchange', href: '#' },
  { label: 'WhatsApp', href: WHATSAPP_URL, external: true },
];
