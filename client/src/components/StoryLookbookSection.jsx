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
            </a>
          );
        })}
      </div>
    </section>
  );
}
