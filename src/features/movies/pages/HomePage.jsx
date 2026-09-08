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
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    pageTitle,
    isSearching,
  } = useMovieFilter();

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

      {isLoading && <MovieGridSkeleton />}

      {isError && (
        <div className="p-10 text-red-500" role="alert">
          Failed to load movies.
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {movies?.length > 0 ? (
            <>
              <MovieGrid movies={movies} />

              {!isSearching && hasNextPage && (
                <InfiniteScrollTrigger
                  onIntersect={() => {
                    if (!isFetchingNextPage) {
                      fetchNextPage();
                    }
                  }}
                />
              )}

              {!isSearching && isFetchingNextPage && (
                <div className="mt-6">
                  <MovieGridSkeleton count={4} />
                </div>
              )}
            </>
          ) : (
            <p>No movies found.</p>
          )}
        </>
      )}
    </div>
  );
}

export default HomePage;
