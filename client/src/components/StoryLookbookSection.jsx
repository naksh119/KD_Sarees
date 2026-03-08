/**
 * Story / Lookbook section – four panels (Our History, Nalli Promise, Lookbook, Press).
 * On hover, the hovered panel expands to the same width as the first panel.
 */

import { useState } from 'react';
import sareeImage from '../assets/images/saree.webp';
import sareeImage2 from '../assets/images/sareeImage2.webp';
import sareeImage3 from '../assets/images/sareeimage3.jpg';

// Lookbook image URL from storybook page (storybookimage1.htm)
const LOOKBOOK_IMAGE_URL = 'https://cdn.shopify.com/s/files/1/0944/8862/5451/files/Lookbook-Picture.jpg';

const PANELS = [
  {
    id: 'our-history',
    title: 'Our History',
    image: sareeImage,
    alt: 'Our History',
    href: '#',
    grayscale: true,
  },
  {
    id: 'nalli-promise',
    title: 'Nalli Promise',
    image: sareeImage2,
    alt: 'Nalli Promise',
    href: '#',
    grayscale: true,
  },
  {
    id: 'lookbook',
    title: 'Lookbook',
    image: LOOKBOOK_IMAGE_URL,
    alt: 'Lookbook',
    href: '#',
    grayscale: false,
  },
  {
    id: 'press',
    title: 'Press',
    image: sareeImage3,
    alt: 'Press',
    href: '#',
    grayscale: false,
    showWhatsApp: true,
  },
];

export default function StoryLookbookSection() {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section
      className="w-full"
      aria-label="Our story, promise, lookbook and press"
    >
      <div className="flex h-[400px] sm:h-[480px] md:h-[520px] lg:h-[560px]">
        {PANELS.map((panel) => {
          const isHovered = hoveredId === panel.id;
          const isFirst = panel.id === PANELS[0].id;
          // First panel width when expanded: use same flex as "expanded" state
          const expanded = isHovered || (isFirst && hoveredId === null);

          return (
            <a
              key={panel.id}
              href={panel.href}
              className="story-panel group relative flex min-w-0 overflow-hidden transition-[flex] duration-1000 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-800 focus-visible:ring-offset-2"
              style={{
                flex: expanded ? '3 1 38%' : '1 1 15%',
              }}
              onMouseEnter={() => setHoveredId(panel.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div
                className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-[transform,filter] duration-1000 ease-in-out group-hover:scale-105 ${panel.grayscale ? 'grayscale' : ''} ${expanded && panel.grayscale ? 'grayscale-0' : ''}`}
                style={{ backgroundImage: `url(${panel.image})` }}
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                aria-hidden
              />
              <span className="absolute bottom-0 left-0 p-4 text-lg font-medium text-white drop-shadow-md sm:text-xl md:p-5 md:text-2xl">
                {panel.title}
              </span>
              {panel.showWhatsApp && (
                <div
                  className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] shadow-lg"
                  aria-hidden
                >
                  <svg
                    className="h-5 w-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
              )}
            </a>
          );
        })}
      </div>
    </section>
  );
}
