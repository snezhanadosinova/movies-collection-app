export default function PersonDetailsSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading person"
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
    >
      <span className="sr-only">Loading person...</span>

      <div
        aria-hidden="true"
        className="grid gap-8 skeleton-pulse md:grid-cols-[260px_1fr]"
      >
        <div className="mx-auto aspect-[2/3] w-48 rounded-2xl bg-zinc-800 md:w-full" />

        <div className="space-y-6">
          <div className="h-12 w-3/4 rounded bg-zinc-800" />
          <div className="h-6 w-1/3 rounded bg-zinc-800" />
          <div className="h-40 rounded-2xl bg-zinc-800" />
          <div className="h-40 rounded-2xl bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}
