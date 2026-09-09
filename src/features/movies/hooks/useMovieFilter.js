import { useSearchParams } from "react-router-dom";

import {
  MIN_SEARCH_LENGTH,
  useSearchMovies,
} from "@/features/movies/hooks/useSearchMovies";
import { useMovieGenres } from "@/features/movies/hooks/useMovieGenres";
import { useInfiniteDiscoverMovies } from "@/features/movies/hooks/useInfiniteDiscoverMovies";
import { useInfinitePopularMovies } from "@/features/movies/hooks/useInfinitePopularMovies";
import { useDebounce } from "@/hooks/useDebounce";
import { uniqueMovies } from "@/utils/uniqueMovies";

export const useMovieFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("q") ?? "";
  const selectedGenre = searchParams.get("genre") ?? "";

  const setSearch = (value) => {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);

        if (value === "") {
          next.delete("q");
        } else {
          next.set("q", value);
        }

        return next;
      },
      {
        replace: true,
        preventScrollReset: true,
        flushSync: true,
      },
    );
  };

  const setSelectedGenre = (value) => {
    if (value === selectedGenre) return;

    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);

        if (value === "") {
          next.delete("genre");
        } else {
          next.set("genre", value);
        }

        return next;
      },
      {
        preventScrollReset: true,
      },
    );
  };

  const debouncedSearch = useDebounce(search.trim());
  const isSearching = debouncedSearch.length >= MIN_SEARCH_LENGTH;

  const { data: genres = [] } = useMovieGenres();

  const popularQuery = useInfinitePopularMovies();
  const searchQuery = useSearchMovies(debouncedSearch);
  const discoverQuery = useInfiniteDiscoverMovies(selectedGenre);

  const paginationQuery = selectedGenre ? discoverQuery : popularQuery;
  const activeQuery = isSearching ? searchQuery : paginationQuery;

  const sourceMovies = isSearching
    ? (searchQuery.data ?? [])
    : (paginationQuery.data?.pages.flatMap((page) => page.results) ?? []);

  // Search results must also match the selected genre.
  const filteredMovies =
    isSearching && selectedGenre
      ? sourceMovies.filter((movie) =>
          movie.genre_ids?.includes(Number(selectedGenre)),
        )
      : sourceMovies;

  const movies = uniqueMovies(filteredMovies);

  const isFetchNextPageError =
    !isSearching && paginationQuery.isFetchNextPageError;

  const isError = activeQuery.isError && activeQuery.data === undefined;

  const isRefreshError =
    activeQuery.isError &&
    activeQuery.data !== undefined &&
    !isFetchNextPageError;

  const selectedGenreName = genres.find(
    (genre) => String(genre.id) === selectedGenre,
  )?.name;

  const pageTitle = isSearching
    ? "Search Results"
    : selectedGenre
      ? selectedGenreName
        ? `${selectedGenreName} Movies`
        : "Filtered Movies"
      : "Popular Movies";

  return {
    search,
    setSearch,
    selectedGenre,
    setSelectedGenre,
    isSearching,

    movies,
    isLoading: activeQuery.isLoading,
    isFetching: activeQuery.isFetching,
    isError,
    isRefreshError,
    refetch: activeQuery.refetch,

    hasNextPage: !isSearching && paginationQuery.hasNextPage,
    isFetchingNextPage: !isSearching && paginationQuery.isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage: paginationQuery.fetchNextPage,

    pageTitle,

    isSearchingMore: isSearching && searchQuery.isSearchingMore,
    searchLimitReached: isSearching && searchQuery.searchLimitReached,
    isSearchPaused: isSearching && searchQuery.isSearchPaused,
  };
};
