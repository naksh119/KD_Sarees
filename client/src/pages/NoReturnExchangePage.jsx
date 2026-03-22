import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import StorefrontLayout from '../components/StorefrontLayout'
import { SITE_EMAIL, WHATSAPP_URL, PATHS } from '../siteLinks'

function ShieldIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
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

function CheckCircleIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function AlertIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
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

const PAGE_TITLE = 'No Return & Exchange Policy | KD Sarees — Sarees & Ethnic Wear'
const META_DESCRIPTION =
  'KD Sarees return and exchange policy for sarees, blouses, and stitched pieces: hygiene-based policy, exceptions for damaged or incorrect orders, 48-hour reporting window, and how to contact customer care in India.'

function buildPolicyJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'No Return & Exchange Policy',
    description: META_DESCRIPTION,
    isPartOf: { '@type': 'WebSite', name: 'KD Sarees' },
    mainEntity: {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Does KD Sarees accept returns or exchanges on sarees?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'For hygiene and quality assurance, we do not accept returns or exchanges on sarees, unstitched fabric, or stitched pieces once an order is confirmed and shipped, except when you receive a damaged item or the wrong product.',
          },
        },
        {
          '@type': 'Question',
          name: 'What should I do before placing an order?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Review product images, descriptions, and blouse measurements carefully. Contact us before purchase if you need help with fabric, colour, or sizing—we are happy to assist.',
          },
        },
        {
          '@type': 'Question',
          name: 'What if my order is wrong or defective?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Email ${SITE_EMAIL} with your order number and clear photos within 48 hours of delivery. You can also message us on WhatsApp for urgent help.`,
          },
        },
      ],
    },
  }
}

export default function NoReturnExchangePage() {
  useEffect(() => {
    const prevTitle = document.title
    document.title = PAGE_TITLE

    let meta = document.querySelector('meta[name="description"]')
    let createdMeta = false
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
      createdMeta = true
    }
    const prevDesc = meta.getAttribute('content') ?? ''
    meta.setAttribute('content', META_DESCRIPTION)

    let canonical = document.querySelector('link[rel="canonical"]')
    let createdCanonical = false
    const path = PATHS.noReturnExchange
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
    script.setAttribute('data-kd-page', 'no-return-exchange')
    script.textContent = JSON.stringify(buildPolicyJsonLd())
    document.head.appendChild(script)

    return () => {
      document.title = prevTitle
      if (createdMeta) {
        meta.remove()
      } else {
        meta.setAttribute('content', prevDesc)
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
        <header className="relative overflow-hidden bg-[#c4a77d] pt-28 pb-16 sm:pt-32 sm:pb-20">
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#b8956a_0%,#c4a77d_50%,#b8956a_100%)] opacity-90"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_65%_at_50%_15%,rgba(255,252,246,0.4),transparent_55%)]"
            aria-hidden
          />
          <div className="pointer-events-none absolute -left-24 top-8 h-64 w-64 rounded-full bg-white/12 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -right-20 bottom-0 h-52 w-52 rounded-full bg-[#2c1810]/12 blur-3xl" aria-hidden />

          <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-black/15 bg-white/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-black backdrop-blur-[2px]">
              <SparkIcon className="h-3.5 w-3.5 text-black" />
              Policies
            </p>
            <h1 className="text-3xl font-bold uppercase tracking-[0.1em] text-black sm:text-4xl md:text-5xl">
              <span className="block sm:inline">No return</span>{' '}
              <span className="text-black/80">&amp;</span>{' '}
              <span className="block sm:inline">exchange</span>
            </h1>
            <p
              className="mt-3 text-2xl text-[#191970] sm:text-3xl md:text-4xl"
              style={{ fontFamily: "'Great Vibes', cursive" }}
            >
              KD Sarees
            </p>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-black sm:text-lg">
              Clear, fair rules for sarees and stitched wear—so you know exactly what to expect when you shop ethnic
              fashion with us across India.
            </p>
            <div className="mx-auto mt-8 flex max-w-lg flex-wrap items-center justify-center gap-3 text-sm text-black">
              <span className="inline-flex items-center gap-2 rounded-lg border border-black/10 bg-white/45 px-3 py-1.5 backdrop-blur-[2px]">
                <ShieldIcon className="h-4 w-4 text-emerald-800" />
                Hygiene &amp; quality first
              </span>
              <span className="text-black/35">|</span>
              <span>Exceptions for defects &amp; wrong items</span>
            </div>
          </div>
        </header>

        <div className="relative z-[1] mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="-mt-10 space-y-6 md:-mt-14">
            {/* Lead summary card */}
            <section
              className="overflow-hidden rounded-2xl border border-[#c4a77d]/30 bg-white shadow-[0_12px_48px_-16px_rgba(196,167,125,0.35)]"
              aria-labelledby="policy-summary-heading"
            >
              <div className="border-b border-[#c4a77d]/20 bg-gradient-to-br from-[#faf6f0] via-white to-[#fffcf6] px-6 py-5 sm:px-8 sm:py-6">
                <h2 id="policy-summary-heading" className="text-lg font-bold uppercase tracking-[0.12em] text-black">
                  Policy at a glance
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-black/85 sm:text-base">
                  We do not offer returns or exchanges on sarees, unstitched fabric, or stitched pieces after your order
                  is confirmed and shipped—this protects product hygiene and authenticity. If you receive a{' '}
                  <strong className="font-semibold text-black">damaged</strong> or{' '}
                  <strong className="font-semibold text-black">incorrect</strong> item, we will work with you under the
                  process below.
                </p>
              </div>
              <div className="grid gap-px bg-stone-100 sm:grid-cols-2">
                <div className="bg-white p-6 sm:p-8">
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-700 ring-1 ring-rose-100">
                      <AlertIcon className="h-6 w-6" />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-black">Not eligible</h3>
                      <p className="mt-2 text-sm leading-relaxed text-black/80">
                        Change of mind, colour mismatch on screen, or size preference after dispatch—standard retail
                        returns do not apply to opened or worn ethnic wear.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 sm:p-8">
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100">
                      <CheckCircleIcon className="h-6 w-6" />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-black">We stand behind errors</h3>
                      <p className="mt-2 text-sm leading-relaxed text-black/80">
                        Wrong SKU, manufacturing defect, or shipping damage—reach out quickly with photos so we can
                        verify and resolve.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-12 lg:gap-8 lg:items-start">
              <section
                className="lg:col-span-7"
                aria-labelledby="before-order-heading"
              >
                <div className="rounded-2xl border border-[#c4a77d]/25 bg-white p-6 shadow-[0_4px_24px_-4px_rgba(196,167,125,0.12)] sm:p-8">
                  <h2 id="before-order-heading" className="text-xs font-bold uppercase tracking-[0.2em] text-black">
                    Before you order
                  </h2>
                  <ul className="mt-6 space-y-4">
                    {[
                      'Read fabric names, care instructions, and blouse measurements (where applicable) on the product page.',
                      'Colours can vary slightly by display and lighting—ask us for clarification if you need an exact shade.',
                      'For stitched blouses, confirm sizing with our team if you are between sizes.',
                      'Once production or dispatch begins, cancellations follow our order confirmation terms.',
                    ].map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-relaxed text-black/90">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c4a77d]" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 rounded-2xl border border-stone-200 bg-[#fafaf9] p-6 sm:p-8">
                  <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-black">Damaged or wrong item</h2>
                  <p className="mt-4 text-sm leading-relaxed text-black/85">
                    If your package arrives with a defect, or you received something different from what you ordered,
                    email{' '}
                    <a href={`mailto:${SITE_EMAIL}`} className="font-semibold text-[#191970] underline-offset-2 hover:underline">
                      {SITE_EMAIL}
                    </a>{' '}
                    within <strong className="font-semibold text-black">48 hours of delivery</strong>. Include your
                    order number and clear photos of the issue (packaging, tags, and the problem area). We review each
                    case fairly and respond during business hours.
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-black/85">
                    This window helps us work with couriers and suppliers while evidence is fresh—please check your parcel
                    on arrival.
                  </p>
                </div>
              </section>

              <aside className="space-y-4 lg:col-span-5">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 overflow-hidden rounded-2xl border-2 border-[#25D366] bg-white p-5 text-black shadow-md shadow-stone-200/80 transition hover:bg-[#fafdfb] hover:shadow-lg"
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#25D366]/12 ring-2 ring-[#25D366]/35">
                    <WhatsAppGlyph className="h-8 w-8 text-[#25D366]" />
                  </span>
                  <span className="min-w-0 text-left">
                    <span className="block text-xs font-bold uppercase tracking-wider text-black">Need help first?</span>
                    <span className="mt-0.5 block text-lg font-semibold text-black">Message on WhatsApp</span>
                    <span className="mt-1 block text-sm text-black/85">Fabric, colour, and sizing—ask before you buy</span>
                  </span>
                  <span className="ml-auto hidden text-black/50 transition group-hover:translate-x-0.5 sm:block" aria-hidden>
                    →
                  </span>
                </a>

                <div className="rounded-2xl border border-[#c4a77d]/25 bg-gradient-to-b from-white to-[#faf6f0]/80 p-6 shadow-[0_8px_32px_-12px_rgba(196,167,125,0.2)] sm:p-7">
                  <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-black">Why this policy exists</h2>
                  <p className="mt-4 text-sm leading-relaxed text-black/85">
                    Sarees and tailored pieces are intimate apparel and often delicate. Once opened or tried in a way that
                    affects resale, we cannot guarantee the same standard for the next customer—similar to many premium
                    ethnic and boutique stores in India.
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-black/85">
                    We invest in accurate listings and responsive support so you can shop with confidence before
                    checkout.
                  </p>
                </div>

                <nav className="rounded-2xl border border-[#c4a77d]/30 bg-white p-2" aria-label="Contact">
                  <Link
                    to={PATHS.contact}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-[#c4a77d] px-4 py-3 text-sm font-bold uppercase tracking-[0.12em] text-black shadow-md shadow-[#c4a77d]/30 transition hover:bg-[#b8956a] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#c4a77d] focus:ring-offset-2"
                  >
                    Contact us
                  </Link>
                </nav>
              </aside>
            </div>
          </div>
        </div>
      </article>
    </StorefrontLayout>
  )
}
