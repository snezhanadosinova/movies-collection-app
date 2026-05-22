import MovieGrid from "@/components/movie/MovieGrid";
import MovieSearch from "@/components/movie/MovieSearch";
import GenreFilter from "@/components/movie/GenreFilter";
import InfiniteScrollTrigger from "@/components/common/InfiniteScrollTrigger";
import MovieSlider from "@/components/movie/MovieSlider";
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

      {/* Title */}
      <h1 className="mb-8 text-4xl font-bold">{pageTitle}</h1>

      {/* Loading state */}
      {isLoading && <div className="p-10">Loading movies...</div>}

      {/* Error state */}
      {isError && (
        <div className="p-10 text-red-500">Failed to load movies.</div>
      )}

      {/* Movies */}
      {!isLoading && !isError && (
        <>
          {movies?.length > 0 ? (
            <>
              <MovieGrid movies={movies} />
              {!isSearching && (
                <InfiniteScrollTrigger
                  onIntersect={() => {
                    if (hasNextPage && !isFetchingNextPage) {
                      fetchNextPage();
                    }
                  }}
                />
              )}
              {isFetchingNextPage && (
                <div className="py-10 text-center">Loading more movies...</div>
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
