/**
 * Map API product documents to ProductCard / ProductSection shape.
 */

export function mapApiProductToCard(p) {
  if (!p) return null
  return {
    id: p._id,
    imageSrc: p.images?.[0] || '',
    imageSrcHover: p.images?.[1] || p.images?.[0] || '',
    imageAlt: p.name,
    productTitle: p.name,
    originalPrice: Math.round((p.price || 0) * 1.25),
    currentPrice: p.price || 0,
    discountPercentage: 20,
    rating: 4.5,
    reviewCount: 0,
    isSale: true,
    showAddToCartButton: true,
    href: '#',
    createdAt: p.createdAt,
  }
}

export function mapApiProducts(list) {
  if (!Array.isArray(list)) return []
  return list.map(mapApiProductToCard).filter(Boolean)
}
