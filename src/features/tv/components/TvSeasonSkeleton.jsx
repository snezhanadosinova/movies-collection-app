export default function TvSeasonSkeleton() {
  return (
    <div role="status" aria-label="Loading season"
      className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <span className="sr-only">Loading season...</span>
      <div aria-hidden="true" className="space-y-8 motion-safe:animate-pulse">
        <div className="h-11 w-40 rounded bg-zinc-800" />
        <div className="grid gap-6 sm:grid-cols-[180px_1fr]">
          <div className="aspect-[2/3] w-36 rounded-xl bg-zinc-800 sm:w-full" />
          <div className="space-y-4">
            <div className="h-12 w-2/3 rounded bg-zinc-800" />
            <div className="h-6 w-1/3 rounded bg-zinc-800" />
            <div className="h-28 rounded bg-zinc-800" />
          </div>
        </div>
        {[1, 2, 3].map((item) => (
          <div key={item} className="grid gap-5 rounded-2xl border border-zinc-800 p-4 sm:grid-cols-[240px_1fr]">
            <div className="aspect-video rounded-xl bg-zinc-800" />
            <div className="space-y-3">
              <div className="h-7 w-2/3 rounded bg-zinc-800" />
              <div className="h-16 rounded bg-zinc-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
