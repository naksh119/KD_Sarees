/**
 * Footer "Get In Touch" column: brand name, working hours, WhatsApp, Call.
 */

export default function FooterGetInTouch() {
  const phone = '+91 9685187167';
  return (
    <div className="flex flex-col">
      <h3 className="text-sm font-bold uppercase tracking-wide text-white/95">
        Get In Touch
      </h3>
      <p className="mt-4 text-xl font-bold tracking-wide text-white">
        SUDATHI
      </p>
      <div className="mt-4 space-y-2 text-sm text-white/75">
        <p className="font-medium text-white/90">Working Hours:</p>
        <p>10:00 AM - 6:30 PM (Monday-Saturday)</p>
        <p>
          <a href={`https://wa.me/${phone.replace(/\s/g, '')}`} className="hover:text-white transition-colors">
            Whatsapp Us: {phone}
          </a>
        </p>
        <p>
          <a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-white transition-colors">
            Call Us: {phone}
          </a>
        </p>
      </div>
    </div>
  );
}
