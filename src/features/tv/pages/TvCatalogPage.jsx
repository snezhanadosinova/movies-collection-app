import FavoriteButton from "@/components/movie/FavoriteButton";
import { useCallback, useId } from "react";
import MediaCard from "@/components/media/MediaCard";
import MovieGridSkeleton from "@/components/movie/MovieGridSkeleton";
import InfiniteScrollTrigger from "@/components/common/InfiniteScrollTrigger";
import { useTvCatalog, TV_SEARCH_PAGE_LIMIT } from "../hooks/useTvCatalog";

const controlClass = "min-h-11 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400";
const buttonClass = "min-h-11 rounded-xl bg-red-500 px-5 py-2 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 disabled:opacity-50";

export default function TvCatalogPage() {
  const searchId = useId();
  const genreId = useId();
  const { search, genre, setSearch, setGenre, series, genresQuery, query,
    isSearching, searchingMore, limitReached, title } = useTvCatalog();

  const { hasNextPage, isFetching, fetchNextPage } = query;

  const loadMore = useCallback(() => {
    if (!isSearching && hasNextPage && !isFetching) {
      void fetchNextPage({ cancelRefetch: false });
    }
  }, [isSearching, hasNextPage, isFetching, fetchNextPage]);

  const paused = query.fetchStatus === "paused";
  const initialError = query.isError && !query.data;
  const waiting = !query.data || searchingMore || paused;
  const genres = genresQuery.data ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 text-white sm:px-6 lg:px-8">
      <h1 className="mb-3 text-3xl font-bold sm:text-4xl">{title}</h1>
      <p className="mb-8 text-zinc-400">Discover your next series.</p>

      <div className="mb-8 grid gap-4 sm:grid-cols-[1fr_240px]">
        <div>
          <label htmlFor={searchId} className="mb-2 block text-sm">Search TV series</label>
          <input id={searchId} type="search" value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Enter a series title..." className={controlClass} />
        </div>
        <div>
          <label htmlFor={genreId} className="mb-2 block text-sm">Genre</label>
          <select id={genreId} value={genre} aria-busy={genresQuery.isFetching}
            onChange={(event) => setGenre(event.target.value)} className={controlClass}>
            <option value="">All Genres</option>
            {genre && !genres.some((item) => String(item.id) === genre) &&
              <option value={genre} disabled>Selected genre</option>}
            {genres.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <div className="mt-2 min-h-11 text-sm text-zinc-400">
            {genresQuery.isPending && <p role="status">Loading genres...</p>}
            {genresQuery.isError && <>
              <p role="status">Could not load genres.</p>
              <button type="button" disabled={genresQuery.isFetching}
                onClick={() => genresQuery.refetch({ cancelRefetch: false })}
                className="min-h-11 rounded px-2 text-red-400 focus-visible:outline-2">
                Retry genres
              </button>
            </>}
          </div>
        </div>
      </div>

      {paused && <p role="status" className="mb-4 text-amber-300">Waiting for an internet connection.</p>}

      {query.isError && (
        <div className="mb-6">
          <p role="alert" className="text-red-400">
            {initialError ? "Could not load TV series." : "Could not load all results. Showing available series."}
          </p>
          <button type="button" disabled={query.isFetching || paused} className={buttonClass}
            onClick={() => query.isFetchNextPageError
              ? query.fetchNextPage({ cancelRefetch: false })
              : query.refetch({ cancelRefetch: false })}>
            {query.isFetching ? "Retrying..." : "Retry"}
          </button>
        </div>
      )}

      {series.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {series.map((item) => (
            <MediaCard key={item.id} title={item.name || "Untitled series"}
              to={`/tv/${item.id}`}
              posterPath={item.poster_path} voteAverage={item.vote_average}
              action={<FavoriteButton movieId={item.id} movieTitle={item.name} mediaType="tv" compact />} />
          ))}
        </div>
      ) : !query.isError && waiting ? (
        <MovieGridSkeleton />
      ) : !query.isError ? (
        <p>{limitReached
          ? "No matches in the checked pages. Try a more specific title or another genre."
          : "No series found for these filters."}</p>
      ) : null}

      {searchingMore && !paused && <p role="status" className="mt-6">Searching more results...</p>}
      {limitReached && series.length > 0 && <p role="status" className="mt-6 text-zinc-400">
        Showing matches from the first {TV_SEARCH_PAGE_LIMIT} result pages. Try a more specific title to narrow the search.
      </p>}

      {!isSearching && query.isFetchingNextPage && <div className="mt-6"><MovieGridSkeleton count={4} /></div>}
      {!isSearching && series.length > 0 && query.hasNextPage &&
        !query.isFetching && !query.isError && !paused &&
        <InfiniteScrollTrigger onIntersect={loadMore} />}
    </div>
  );
}
