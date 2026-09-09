import { useCallback } from "react";

import MovieGrid from "@/components/movie/MovieGrid";
import MovieSearch from "@/components/movie/MovieSearch";
import GenreFilter from "@/components/movie/GenreFilter";
import InfiniteScrollTrigger from "@/components/common/InfiniteScrollTrigger";
import MovieSlider from "@/components/movie/MovieSlider";
import MovieGridSkeleton from "@/components/movie/MovieGridSkeleton";

import { useMovieFilter } from "../hooks/useMovieFilter";

function HomePage() {
  const {
    search,
    setSearch,
    selectedGenre,
    setSelectedGenre,
    movies,
    isLoading,
    isFetching,
    isError,
    isRefreshError,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
    pageTitle,
    isSearching,
    isSearchingMore,
    searchLimitReached,
    isSearchPaused,
  } = useMovieFilter();

  const handleLoadMore = useCallback(() => {
    if (isSearching || !hasNextPage || isFetching) {
      return;
    }

    void fetchNextPage({ cancelRefetch: false });
  }, [isSearching, hasNextPage, isFetching, fetchNextPage]);

  const canAutoLoad =
    !isSearching &&
    hasNextPage &&
    !isFetching &&
    !isFetchNextPageError &&
    !isRefreshError;

  const retryButtonClassName =
    "mt-3 rounded-lg bg-red-500 px-4 py-2 text-white " +
    "transition hover:bg-red-600 disabled:opacity-50";

  const isWaitingForSearch = isSearching && (isSearchingMore || isSearchPaused);

  const emptyMessage = searchLimitReached
    ? "No matches in the checked results. Try a more specific title or another genre."
    : "No movies found for these filters.";

  return (
    <div className="mx-auto max-w-7xl p-10">
      <MovieSlider />

      <div className="mb-10 flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <MovieSearch value={search} onChange={setSearch} />
        </div>

        <GenreFilter value={selectedGenre} onChange={setSelectedGenre} />
      </div>

      <h1 className="mb-8 text-4xl font-bold">{pageTitle}</h1>

      {isSearchPaused && (
        <p className="mb-6 text-amber-300" role="status">
          Search is paused. Waiting for an internet connection.
        </p>
      )}

      {isLoading && <MovieGridSkeleton />}

      {isError && (
        <div className="py-6">
          <p className="text-red-400" role="alert">
            Failed to load movies.
          </p>

          <button
            type="button"
            onClick={() => refetch({ cancelRefetch: false })}
            disabled={isFetching || isSearchPaused}
            className={retryButtonClassName}
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {isRefreshError && (
            <div className="mb-6">
              <p className="text-red-400" role="alert">
                {isSearching
                  ? "Could not finish the search. Showing available results."
                  : "Could not refresh movies. Showing previously loaded results."}
              </p>

              <button
                type="button"
                onClick={() => refetch({ cancelRefetch: false })}
                disabled={isFetching || isSearchPaused}
                className={retryButtonClassName}
              >
                {isFetching ? "Retrying..." : "Retry"}
              </button>
            </div>
          )}

          {movies.length > 0 ? (
            <MovieGrid movies={movies} />
          ) : isWaitingForSearch ? (
            <MovieGridSkeleton />
          ) : !isRefreshError ? (
            <p>{emptyMessage}</p>
          ) : null}

          {isSearchingMore && !isSearchPaused && (
            <p className="mt-6 text-center text-zinc-400" role="status">
              Searching more results...
            </p>
          )}

          {isSearching && searchLimitReached && movies.length > 0 && (
            <p className="mt-6 text-zinc-400" role="status">
              Showing matches from the first 5 result pages. Use a more specific
              title to narrow the search.
            </p>
          )}

          {movies.length > 0 && canAutoLoad && (
            <InfiniteScrollTrigger onIntersect={handleLoadMore} />
          )}

          {!isSearching && isFetchingNextPage && (
            <div className="mt-6">
              <MovieGridSkeleton count={4} />
            </div>
          )}

          {!isSearching && isFetchNextPageError && (
            <div className="mt-6 text-center">
              <p className="text-red-400" role="alert">
                Could not load more movies.
              </p>

              <button
                type="button"
                onClick={handleLoadMore}
                disabled={isFetching}
                className={retryButtonClassName}
              >
                {isFetching ? "Retrying..." : "Retry"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default HomePage;
