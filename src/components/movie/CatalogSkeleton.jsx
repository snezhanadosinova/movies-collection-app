import MovieGridSkeleton from "./MovieGridSkeleton";

export default function CatalogSkeleton({ label = "Loading movies" }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div aria-hidden="true" className="mb-8 space-y-6 skeleton-pulse">
        <div className="h-10 w-64 max-w-full rounded-xl bg-zinc-800" />
        <div className="grid gap-4 sm:grid-cols-[1fr_240px]">
          <div className="h-14 rounded-xl bg-zinc-800" />
          <div className="h-14 rounded-xl bg-zinc-800" />
        </div>
      </div>
      <MovieGridSkeleton label={label} />
    </div>
  );
}
