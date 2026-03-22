/**
 * Footer "Get In Touch" column: brand name, email, working hours, WhatsApp, Call.
 */

import { SITE_EMAIL, SITE_PHONE_DISPLAY, SITE_PHONE_TEL, WHATSAPP_URL } from '../../siteLinks';

export default function FooterGetInTouch() {
  return (
    <div className="flex flex-col">
      <h3 className="text-sm font-bold uppercase tracking-wide text-white/95">
        Get In Touch
      </h3>
      <p
        className="mt-4 text-3xl font-normal tracking-normal text-white normal-case"
        style={{ fontFamily: "'Great Vibes', cursive" }}
      >
        Kd Sarees
      </p>
      <div className="mt-4 space-y-2 text-sm text-white/75">
        <p>
          <a href={`mailto:${SITE_EMAIL}`} className="hover:text-white transition-colors">
            {SITE_EMAIL}
          </a>
        </p>
        <p className="font-medium text-white/90">Working Hours:</p>
        <p>10:00 AM - 6:30 PM (Monday-Saturday)</p>
        <p>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            WhatsApp: {SITE_PHONE_DISPLAY}
          </a>
        </p>
        <p>
          <a href={`tel:${SITE_PHONE_TEL}`} className="hover:text-white transition-colors">
            Call: {SITE_PHONE_DISPLAY}
          </a>
        </p>
      </div>
    </div>
  );
}
