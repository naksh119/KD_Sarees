/**
 * Loading placeholder matching ReviewCard layout (image, text block, stars, name, product line).
 */

export default function ReviewCardSkeleton() {
  return (
    <article
      className="flex h-[300px] w-full shrink-0 flex-col overflow-hidden rounded-lg bg-white shadow-md"
      aria-hidden
    >
      <div className="mt-[5px] flex h-[150px] w-full max-w-[150px] shrink-0 items-center justify-center self-center overflow-hidden rounded-lg bg-slate-100">
        <div className="h-full w-full rounded-lg shimmer" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col px-2 py-2 text-left">
        <div className="space-y-1.5">
          <div className="h-2.5 w-full rounded shimmer" />
          <div className="h-2.5 w-[92%] rounded shimmer" />
          <div className="h-2.5 w-[68%] rounded shimmer" />
        </div>
        <div className="mt-1.5 flex items-center justify-center gap-0.5 sm:justify-start">
          <span className="flex gap-0.5" aria-hidden>
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className="inline-block h-[18px] w-[18px] rounded-sm shimmer" />
            ))}
          </span>
        </div>
        <div className="mt-1.5 flex items-center gap-1">
          <div className="h-3 w-28 max-w-full rounded shimmer" />
        </div>
        <div className="mt-0.5 h-2.5 w-[55%] rounded shimmer" />
      </div>
    </article>
  );
}
