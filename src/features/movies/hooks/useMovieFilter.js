import { useState } from "react";

import {
  MIN_SEARCH_LENGTH,
  useSearchMovies,
} from "@/features/movies/hooks/useSearchMovies";
import { useInfiniteDiscoverMovies } from "@/features/movies/hooks/useInfiniteDiscoverMovies";
import { useInfinitePopularMovies } from "@/features/movies/hooks/useInfinitePopularMovies";
import { useDebounce } from "@/hooks/useDebounce";
import { uniqueMovies } from "@/utils/uniqueMovies";

export const useMovieFilter = () => {
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  const debouncedSearch = useDebounce(search.trim());
  const isSearching = debouncedSearch.length >= MIN_SEARCH_LENGTH;

  const popularQuery = useInfinitePopularMovies();
  const searchQuery = useSearchMovies(debouncedSearch);
  const discoverQuery = useInfiniteDiscoverMovies(selectedGenre);

  const paginationQuery = selectedGenre ? discoverQuery : popularQuery;

  const activeQuery = isSearching ? searchQuery : paginationQuery;

  const movies = uniqueMovies(
    isSearching
      ? (searchQuery.data ?? [])
      : (paginationQuery.data?.pages.flatMap((page) => page.results) ?? []),
  );

  const isFetchNextPageError =
    !isSearching && paginationQuery.isFetchNextPageError;

  // Only replace the results with an error when no data is available.
  const isError = activeQuery.isError && activeQuery.data === undefined;

  const isRefreshError =
    activeQuery.isError &&
    activeQuery.data !== undefined &&
    !isFetchNextPageError;

  const pageTitle = isSearching
    ? "Search Results"
    : selectedGenre
      ? `${selectedGenre} Movies`
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
  };
};
