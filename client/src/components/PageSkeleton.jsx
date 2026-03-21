function PageSkeleton() {
  return (
    <div className="page-skeleton" aria-label="Loading page" role="status">
      <div className="page-skeleton__bar shimmer" />
      <div className="page-skeleton__hero shimmer" />
      <div className="page-skeleton__grid">
        <div className="page-skeleton__card shimmer" />
        <div className="page-skeleton__card shimmer" />
        <div className="page-skeleton__card shimmer" />
      </div>
    </div>
  )
}

export default PageSkeleton
