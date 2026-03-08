/**
 * Main site footer: Popular Searches, Information, Customer Care,
 * Get In Touch, Newsletter, Download App + trending terms.
 */

import FooterLinksColumn from './FooterLinksColumn';
import FooterGetInTouch from './FooterGetInTouch';
import FooterNewsletter from './FooterNewsletter';
import FooterBottomBar from './FooterBottomBar';
import ChatWidget from './ChatWidget';

const POPULAR_SEARCHES = [
  { label: 'Sudathi Gold', href: '#' },
  { label: 'Silk Saree Sale', href: '#' },
  { label: 'Celebrity Sarees', href: '#' },
  { label: 'Wedding Collection', href: '#' },
  { label: 'Sarees Saturday', href: '#' },
  { label: 'Ready To Wear Sarees', href: '#' },
];

const INFORMATION = [
  { label: 'Blogs', href: '#' },
  { label: 'Reviews', href: '#' },
  { label: 'Search', href: '#' },
  { label: 'Login', href: '#' },
  { label: 'FAQs', href: '#' },
  { label: 'Create Account', href: '#' },
];

const CUSTOMER_CARE = [
  { label: 'About Us', href: '#' },
  { label: 'Contact Us', href: '#' },
  { label: 'Return Policy', href: '#' },
  { label: 'Shipping Policy', href: '#' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Track Order', href: '#' },
  { label: 'Place Return Request', href: '#' },
];

export default function Footer() {
  return (
    <>
      <footer
        className="bg-[#0f172a] text-white"
        role="contentinfo"
        aria-label="Site footer"
      >
        <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
            <FooterLinksColumn title="Popular Searches" links={POPULAR_SEARCHES} />
            <FooterLinksColumn title="Information" links={INFORMATION} />
            <FooterLinksColumn title="Customer Care" links={CUSTOMER_CARE} />
            <FooterGetInTouch />
            <FooterNewsletter />
          </div>
          <FooterBottomBar />
        </div>
      </footer>
      <ChatWidget />
    </>
  );
}
