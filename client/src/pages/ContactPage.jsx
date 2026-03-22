import { useEffect, useState } from 'react'
import StorefrontLayout from '../components/StorefrontLayout'
import { SITE_EMAIL, SITE_PHONE_DISPLAY, SITE_PHONE_TEL, WHATSAPP_URL, PATHS } from '../siteLinks'

const PAGE_TITLE =
  'Contact KD Sarees | Customer Care — Sarees, Silk Sarees & Ethnic Wear Online (India)'
const META_DESCRIPTION =
  'Contact KD Sarees for saree orders, silk sarees, lehengas, and ethnic wear in India. Customer care via email, phone & WhatsApp. Help with blouse sizing, fabric & colour, and Pan India delivery. Mon–Sat 10 AM–6:30 PM IST.'
const META_KEYWORDS =
  'KD Sarees contact, contact KD Sarees, sarees online India, silk sarees customer care, ethnic wear support, Indian saree store, WhatsApp saree shopping, blouse measurement help, designer sarees enquiry, Pan India saree delivery, traditional wear India'

function buildContactPageJsonLd(origin) {
  const site = origin || ''
  const telE164 = `+${SITE_PHONE_TEL}`
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact KD Sarees — Customer Care',
    description: META_DESCRIPTION,
    url: `${site}${PATHS.contact}`,
    isPartOf: { '@type': 'WebSite', name: 'KD Sarees', url: site || '/' },
    mainEntity: {
      '@type': 'Organization',
      name: 'KD Sarees',
      url: site || '/',
      email: SITE_EMAIL,
      telephone: telE164,
      areaServed: { '@type': 'Country', name: 'India' },
      description:
        'Online saree and ethnic wear store — silk sarees, traditional wear, and accessories with delivery across India.',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: SITE_EMAIL,
        telephone: telE164,
        availableLanguage: ['English', 'Hindi'],
        areaServed: 'IN',
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '10:00',
          closes: '18:30',
        },
      },
    },
  }
}

function MailIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  )
}

function PhoneIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  )
}

function WhatsAppGlyph({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function ClockIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function SparkIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  )
}

export default function ContactPage() {
  const [sent, setSent] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSent(true)
  }

  useEffect(() => {
    const prevTitle = document.title
    document.title = PAGE_TITLE

    let metaDesc = document.querySelector('meta[name="description"]')
    let createdDesc = false
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
      createdDesc = true
    }
    const prevDesc = metaDesc.getAttribute('content') ?? ''
    metaDesc.setAttribute('content', META_DESCRIPTION)

    let metaKw = document.querySelector('meta[name="keywords"]')
    let createdKw = false
    if (!metaKw) {
      metaKw = document.createElement('meta')
      metaKw.setAttribute('name', 'keywords')
      document.head.appendChild(metaKw)
      createdKw = true
    }
    const prevKw = metaKw.getAttribute('content') ?? ''
    metaKw.setAttribute('content', META_KEYWORDS)

    let canonical = document.querySelector('link[rel="canonical"]')
    let createdCanonical = false
    const path = PATHS.contact
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
      createdCanonical = true
    }
    const prevCanonical = canonical.getAttribute('href') ?? ''
    canonical.setAttribute('href', `${window.location.origin}${path}`)

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-kd-page', 'contact')
    script.textContent = JSON.stringify(buildContactPageJsonLd(window.location.origin))
    document.head.appendChild(script)

    return () => {
      document.title = prevTitle
      if (createdDesc) {
        metaDesc.remove()
      } else {
        metaDesc.setAttribute('content', prevDesc)
      }
      if (createdKw) {
        metaKw.remove()
      } else {
        metaKw.setAttribute('content', prevKw)
      }
      if (createdCanonical) {
        canonical.remove()
      } else {
        canonical.setAttribute('href', prevCanonical)
      }
      script.remove()
    }
  }, [])

  return (
    <StorefrontLayout>
      <article className="text-black" style={{ fontFamily: "'Poppins', sans-serif" }}>
        {/* Hero — full theme gold #c4a77d (+ subtle depth, readable type) */}
        <section
          className="relative overflow-hidden bg-[#c4a77d] pt-28 pb-16 sm:pt-32 sm:pb-20"
          aria-labelledby="contact-page-heading"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#b8956a_0%,#c4a77d_50%,#b8956a_100%)] opacity-90"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_70%_at_50%_20%,rgba(255,252,246,0.35),transparent_55%)]"
            aria-hidden
          />
          <div className="pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full bg-white/15 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -right-24 bottom-0 h-48 w-48 rounded-full bg-[#2c1810]/10 blur-3xl" aria-hidden />

          <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-black/15 bg-white/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-black backdrop-blur-[2px]">
              <SparkIcon className="h-3.5 w-3.5 text-black" />
              Customer care
            </p>
            <h1
              id="contact-page-heading"
              className="text-4xl font-bold uppercase tracking-[0.12em] text-black sm:text-5xl md:text-6xl"
            >
              <span className="inline-block align-baseline">Contact</span>{' '}
              <span
                className="block pt-1 text-4xl font-normal normal-case leading-none tracking-normal text-[#191970] sm:inline sm:pl-2 sm:pt-0 sm:text-5xl md:text-6xl"
                style={{ fontFamily: "'Great Vibes', cursive" }}
              >
                Kd Sarees
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-black sm:text-lg">
              Get in touch with <strong className="font-semibold">KD Sarees</strong> for{' '}
              <strong className="font-semibold">sarees online</strong>, <strong className="font-semibold">silk sarees</strong>,{' '}
              <strong className="font-semibold">ethnic wear</strong>, and <strong className="font-semibold">traditional wear</strong>{' '}
              across India. We help with orders, blouse sizing, fabric and colour questions, and custom requests —{' '}
              <span className="whitespace-nowrap">email</span>, phone, or WhatsApp. We reply during store hours;{' '}
              <strong className="font-semibold">Pan India delivery</strong> available.
            </p>
            <div className="mx-auto mt-8 flex max-w-md flex-wrap items-center justify-center gap-3 text-sm text-black">
              <span className="inline-flex items-center gap-2 rounded-lg border border-black/10 bg-white/45 px-3 py-1.5 backdrop-blur-[2px]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.75)]" />
                Replies during business hours
              </span>
              <span className="text-black/35">|</span>
              <span>Pan India delivery</span>
            </div>
          </div>
        </section>

        {/* Main content */}
        <div className="relative z-[1] mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="-mt-12 grid gap-6 lg:-mt-16 lg:grid-cols-12 lg:gap-8 lg:items-start">
            {/* Contact channels — SEO: h2 + structured list */}
            <div className="space-y-4 lg:col-span-5">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 overflow-hidden rounded-2xl border-2 border-[#25D366] bg-white p-5 text-black shadow-md shadow-stone-200/80 transition hover:bg-[#fafdfb] hover:shadow-lg"
                aria-label="Chat on WhatsApp with KD Sarees customer care for saree orders and enquiries"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#25D366]/12 ring-2 ring-[#25D366]/35">
                  <WhatsAppGlyph className="h-8 w-8 text-[#25D366]" />
                </span>
                <span className="min-w-0 text-left">
                  <span className="block text-xs font-bold uppercase tracking-wider text-black">Fastest reply</span>
                  <span className="mt-0.5 block text-lg font-semibold text-black">Chat on WhatsApp</span>
                  <span className="mt-1 block text-sm text-black/85">Tap to open a conversation with our team</span>
                </span>
                <span className="ml-auto hidden text-black/50 transition group-hover:translate-x-0.5 sm:block" aria-hidden>
                  →
                </span>
              </a>

              <div className="rounded-2xl border border-[#c4a77d]/25 bg-white p-6 shadow-[0_4px_24px_-4px_rgba(196,167,125,0.12)]">
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-black">
                  Reach KD Sarees — phone, email &amp; hours
                </h2>
                <ul className="mt-5 space-y-0 divide-y divide-stone-100">
                  <li className="flex gap-4 pb-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-black">
                      <MailIcon />
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-black">Email</p>
                      <a href={`mailto:${SITE_EMAIL}`} className="mt-0.5 block text-base font-medium text-black hover:underline">
                        {SITE_EMAIL}
                      </a>
                    </div>
                  </li>
                  <li className="flex gap-4 py-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-black">
                      <PhoneIcon />
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-black">Phone</p>
                      <a href={`tel:${SITE_PHONE_TEL}`} className="mt-0.5 block text-base font-medium text-black hover:underline">
                        {SITE_PHONE_DISPLAY}
                      </a>
                    </div>
                  </li>
                  <li className="flex gap-4 pt-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-black/10 bg-stone-50 text-black">
                      <ClockIcon />
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-black">Store hours</p>
                      <p className="mt-0.5 text-base font-medium text-black">10:00 AM – 6:30 PM</p>
                      <p className="text-sm text-black/80">Monday – Saturday</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Form card */}
            <div className="lg:col-span-7">
              <div className="overflow-hidden rounded-2xl border border-[#c4a77d]/25 bg-white shadow-[0_8px_40px_-12px_rgba(196,167,125,0.18)]">
                <div className="border-b border-[#c4a77d]/20 bg-gradient-to-r from-[#faf6f0]/90 to-white px-6 py-5 sm:px-8">
                  <h2 className="text-lg font-bold uppercase tracking-wider text-black">Send a message to KD Sarees</h2>
                  <p className="mt-1 text-sm text-black/85">
                    Ask about saree orders, silk sarees, ethnic wear, or blouse measurements — we will respond as soon as we
                    can during business hours.
                  </p>
                </div>

                <div className="px-6 py-6 sm:px-8 sm:py-8">
                  {sent ? (
                    <div
                      className="rounded-xl border border-[#c4a77d]/35 bg-[#faf6f0] px-5 py-8 text-center"
                      role="status"
                    >
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-black/10 bg-[#c4a77d] text-black shadow-lg shadow-[#c4a77d]/35">
                        <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-lg font-semibold text-black">Thank you for reaching out</p>
                      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-black/85">
                        This demo form does not send email yet. For a real enquiry, please email us or use WhatsApp — we
                        will be happy to assist.
                      </p>
                      <a
                        href={WHATSAPP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg border-2 border-[#25D366] bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[#f0fdf4]"
                      >
                        <WhatsAppGlyph className="h-4 w-4 text-[#25D366]" />
                        Open WhatsApp
                      </a>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleSubmit}
                      className="space-y-5"
                      name="contact"
                      aria-label="Contact KD Sarees — send enquiry about sarees and ethnic wear"
                    >
                      <div>
                        <label htmlFor="contact-name" className="block text-xs font-bold uppercase tracking-wider text-black">
                          Name
                        </label>
                        <input
                          id="contact-name"
                          name="name"
                          required
                          autoComplete="name"
                          placeholder="Your name"
                          className="mt-2 w-full rounded-xl border border-[#d6c2a1] bg-[#fffcf6] px-4 py-3 text-sm text-black placeholder:text-black/40 transition focus:border-[#c4a77d] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c4a77d]/30"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="block text-xs font-bold uppercase tracking-wider text-black">
                          Email
                        </label>
                        <input
                          id="contact-email"
                          name="email"
                          type="email"
                          required
                          autoComplete="email"
                          placeholder="you@example.com"
                          className="mt-2 w-full rounded-xl border border-[#d6c2a1] bg-[#fffcf6] px-4 py-3 text-sm text-black placeholder:text-black/40 transition focus:border-[#c4a77d] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c4a77d]/30"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-msg" className="block text-xs font-bold uppercase tracking-wider text-black">
                          Message
                        </label>
                        <textarea
                          id="contact-msg"
                          name="message"
                          rows={5}
                          required
                          placeholder="Tell us about your order, sizing, or any question…"
                          className="mt-2 w-full resize-y rounded-xl border border-[#d6c2a1] bg-[#fffcf6] px-4 py-3 text-sm text-black placeholder:text-black/40 transition focus:border-[#c4a77d] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c4a77d]/30"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full rounded-xl bg-[#c4a77d] px-4 py-3.5 text-sm font-bold uppercase tracking-[0.15em] text-black shadow-md shadow-[#c4a77d]/30 transition hover:bg-[#b8956a] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#c4a77d] focus:ring-offset-2"
                      >
                        Submit message
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </StorefrontLayout>
  )
}
