export default function MovieDetailsSkeleton({ navigation }) {
  return (
    <section className="bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 min-h-11">
          {navigation ?? <div aria-hidden="true" className="h-11 w-36 rounded bg-zinc-800 skeleton-pulse" />}
        </div>
        <div role="status" aria-label="Loading movie">
          <span className="sr-only">Loading movie...</span>
          <div aria-hidden="true" className="grid items-start gap-8 skeleton-pulse md:grid-cols-[260px_minmax(0,1fr)]">
            <div className="mx-auto aspect-[2/3] w-36 rounded-2xl bg-zinc-800 sm:w-44 lg:mx-0 lg:w-full" />
            <div className="space-y-5 self-center">
              <div className="h-5 w-40 rounded bg-zinc-800" />
              <div className="h-12 w-4/5 rounded bg-zinc-800" />
              <div className="h-7 w-2/3 rounded bg-zinc-800" />
              <div className="h-24 rounded bg-zinc-800" />
              <div className="h-12 w-full rounded-xl bg-zinc-800 sm:w-60" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
