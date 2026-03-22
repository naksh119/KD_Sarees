import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { api } from '../utils/api'
import StorefrontLayout from '../components/StorefrontLayout'
import { CATEGORY_ROUTES, getCategoryLabelForSlug } from '../siteLinks'
import ProductListingPage from './ProductListingPage'

export default function CategoryPage() {
  const { slug } = useParams()
  const [categoryId, setCategoryId] = useState(null)
  const [resolved, setResolved] = useState(false)

  const known = CATEGORY_ROUTES.some((c) => c.slug === slug)

  useEffect(() => {
    if (!slug || !known) return undefined
    let cancelled = false
    ;(async () => {
      try {
        const categories = await api.getCategories()
        if (cancelled) return
        const match = (categories || []).find(
          (c) => (c.slug || '').toLowerCase() === String(slug).toLowerCase(),
        )
        setCategoryId(match?._id ?? null)
      } catch {
        if (!cancelled) setCategoryId(null)
      } finally {
        if (!cancelled) setResolved(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [slug, known])

  if (!slug || !known) {
    return <Navigate to="/" replace />
  }

  if (!resolved) {
    return (
      <StorefrontLayout>
        <div className="flex justify-center py-24 text-slate-600">Loading…</div>
      </StorefrontLayout>
    )
  }

  const title = getCategoryLabelForSlug(slug)

  return (
    <ProductListingPage
      title={title}
      categoryId={categoryId}
      sort="default"
      requireCategory
      description={
        categoryId
          ? `Browse ${title} — products in this category.`
          : `Products for ${title} will appear here once this category is set up in the catalog.`
      }
    />
  )
}
