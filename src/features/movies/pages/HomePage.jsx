import { useState } from "react";
import MovieGrid from "@/components/movie/MovieGrid";
import MovieSearch from "@/components/movie/MovieSearch";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchMovies } from "../hooks/useSearchMovies";
import GenreFilter from "@/components/movie/GenreFilter";
import InfiniteScrollTrigger from "@/components/common/InfiniteScrollTrigger";
import { useInfiniteDiscoverMovies } from "../hooks/useInfiniteDiscoverMovies";
import { useInfinitePopularMovies } from "../hooks/useInfinitePopularMovies";
import MovieSlider from "@/components/movie/MovieSlider";

function HomePage() {
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const debouncedSearch = useDebounce(search);
  const isSearching = debouncedSearch.trim().length >= 2;

  const {
    data: popularData,
    isLoading: popularLoading,
    isError: popularError,
    fetchNextPage: fetchPopularNextPage,
    hasNextPage: hasPopularNextPage,
    isFetchingNextPage: isFetchingPopularNextPage,
  } = useInfinitePopularMovies();

  const popularMovies =
    popularData?.pages.flatMap((page) => page.results) || [];

  const {
    data: searchedMovies,
    isLoading: searchLoading,
    isError: searchError,
  } = useSearchMovies(debouncedSearch);

  const {
    data: discoverData,
    isLoading: discoverLoading,
    isError: discoverError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteDiscoverMovies(selectedGenre);

  const discoveredMovies =
    discoverData?.pages.flatMap((page) => page.results) || [];

  const movies = isSearching
    ? searchedMovies
    : selectedGenre
      ? discoveredMovies
      : popularMovies;

  const isLoading = isSearching
    ? searchLoading
    : selectedGenre
      ? discoverLoading
      : popularLoading;

  const isError = isSearching
    ? searchError
    : selectedGenre
      ? discoverError
      : popularError;
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
      <h1 className="mb-8 text-4xl font-bold">
        {isSearching ? "Search Results" : "Popular Movies"}
      </h1>

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
                    if (selectedGenre) {
                      if (hasNextPage && !isFetchingNextPage) {
                        fetchNextPage();
                      }
                    } else {
                      if (hasPopularNextPage && !isFetchingPopularNextPage) {
                        fetchPopularNextPage();
                      }
                    }
                  }}
                />
              )}
              {(isFetchingNextPage || isFetchingPopularNextPage) && (
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
