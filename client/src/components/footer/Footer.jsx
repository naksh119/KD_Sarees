/**
 * Main site footer: Categories, Information, Quick links,
 * Get In Touch, Newsletter + trending terms.
 */

import FooterLinksColumn from './FooterLinksColumn';
import FooterGetInTouch from './FooterGetInTouch';
import FooterNewsletter from './FooterNewsletter';
import FooterBottomBar from './FooterBottomBar';
import ChatWidget from './ChatWidget';
import { categoryNavLinks, informationLinks } from '../../siteLinks';

const SHOP_QUICK_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'New Arrivals', href: '/#new-arrivals' },
  { label: 'Best Sellers', href: '/#best-sellers' },
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
            <FooterLinksColumn title="Categories" links={categoryNavLinks} />
            <FooterLinksColumn title="Information" links={informationLinks} />
            <FooterLinksColumn title="Shop" links={SHOP_QUICK_LINKS} />
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
