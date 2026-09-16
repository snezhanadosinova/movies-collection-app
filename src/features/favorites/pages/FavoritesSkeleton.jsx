import MovieGridSkeleton from "@/components/movie/MovieGridSkeleton";
export default function FavoritesSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 text-white sm:px-6">
      <h1 className="mb-6 text-3xl font-bold">Your Favorites</h1>
      <div aria-hidden="true" className="mb-8">
        <div className="mb-2 h-5 w-20 rounded bg-zinc-800 skeleton-pulse" />
        <div className="h-12 w-36 rounded-xl bg-zinc-800 skeleton-pulse" />
      </div>
      <MovieGridSkeleton label="Loading favorites" />
    </div>
  );
}
