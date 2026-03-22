import ProductListingPage from './ProductListingPage'

export default function BestSellersPage() {
  return (
    <ProductListingPage
      title="Best Sellers"
      sort="priceDesc"
      description="Customer favourites and standout pieces — sorted by popularity and value."
    />
  )
}
