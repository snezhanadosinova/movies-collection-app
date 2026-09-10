export default function TvDetailsSkeleton() {
  return (
    <div role="status" aria-label="Loading series"
      className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <span className="sr-only">Loading series...</span>
      <div aria-hidden="true" className="grid gap-8 motion-safe:animate-pulse md:grid-cols-[260px_1fr]">
        <div className="aspect-[2/3] w-48 rounded-2xl bg-zinc-800 md:w-full" />
        <div className="space-y-6">
          <div className="h-14 w-3/4 rounded bg-zinc-800" />
          <div className="h-8 w-1/2 rounded bg-zinc-800" />
          <div className="h-40 rounded bg-zinc-800" />
          <div className="h-28 rounded bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}
