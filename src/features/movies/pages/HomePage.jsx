import { useQuery } from "@tanstack/react-query";
import { Link, Navigate, useLocation } from "react-router-dom";
import MovieSlider from "@/components/movie/MovieSlider";
import RecommendationsSection from "@/components/media/RecommendationsSection";
import { useInfinitePopularMovies } from "../hooks/useInfinitePopularMovies";
import { getTvPage } from "@/features/tv/api/tvApi";
import { uniqueMovies } from "@/utils/uniqueMovies";

const linkClass = "inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-red-300 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 disabled:opacity-50";

function DiscoverySection({ title, mediaType, to, query, items }) {
  const pending = query.isPending || query.isLoading;
  const paused = query.fetchStatus === "paused";
  return (
    <div>
      {pending ? (
        <section aria-label={title}>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p role="status" className="mt-3 text-zinc-400">
            {paused ? "Waiting for an internet connection." : `Loading ${title.toLowerCase()}...`}
          </p>
          <div aria-hidden="true" className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="aspect-[2/3] rounded-xl bg-zinc-900 skeleton-pulse" />
            ))}
          </div>
        </section>
      ) : (
        <RecommendationsSection title={title} description="Popular on TMDB"
          mediaType={mediaType} items={items} />
      )}
      {query.isError && (
        <div className="mt-4">
          <p role="alert" className="text-amber-300">Could not update {title.toLowerCase()}.</p>
          <button type="button" className={linkClass} disabled={query.isFetching || paused}
            onClick={() => query.refetch({ cancelRefetch: false })}>
            {query.isFetching ? "Retrying..." : `Retry ${title.toLowerCase()}`}
          </button>
        </div>
      )}
      <Link to={to} className={linkClass + " mt-4"}>
        View all {mediaType === "tv" ? "series" : "movies"}<span aria-hidden="true" className="ml-2">→</span>
      </Link>
    </div>
  );
}

function HomeDiscovery() {
  const moviesQuery = useInfinitePopularMovies();
  const tvQuery = useQuery({
    queryKey: ["tv", "home", "popular"],
    queryFn: ({ signal }) => getTvPage({ page: 1, signal }),
  });
  const movies = uniqueMovies(moviesQuery.data?.pages?.[0]?.results ?? []).slice(0, 6);
  const series = uniqueMovies(tvQuery.data?.results ?? []).slice(0, 6);

  return (
    <>
      <h1 className="sr-only">Discover movies and TV series</h1>
      <MovieSlider />
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-8 sm:px-6 lg:space-y-16 lg:px-8">
        <DiscoverySection title="Popular Movies" to="/movies" mediaType="movie" query={moviesQuery} items={movies} />
        <DiscoverySection title="Popular TV Series" to="/tv" mediaType="tv" query={tvQuery} items={series} />
      </div>
    </>
  );
}

export default function HomePage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  // Preserve bookmarked catalog URLs without mounting discovery queries.
  if (params.has("q") || params.has("genre")) {
    return <Navigate to={`/movies${location.search}${location.hash}`} replace />;
  }
  return <HomeDiscovery />;
}
