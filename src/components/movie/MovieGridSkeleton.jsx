export default function MovieGridSkeleton({ count = 8 }) {
  return (
    <div role="status" aria-label="Loading movies">
      <span className="sr-only">Loading movies...</span>

      <div
        aria-hidden="true"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {Array.from({ length: count }, (_, index) => (
          <div key={index} className="overflow-hidden rounded-xl bg-zinc-900">
            <div className="h-[400px] animate-pulse bg-zinc-800 motion-reduce:animate-none" />

            <div className="p-4">
              <div className="flex h-7 items-center">
                <div className="h-5 w-3/4 animate-pulse rounded bg-zinc-800 motion-reduce:animate-none" />
              </div>

              <div className="mt-2 flex h-5 items-center">
                <div className="h-4 w-12 animate-pulse rounded bg-zinc-800 motion-reduce:animate-none" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
