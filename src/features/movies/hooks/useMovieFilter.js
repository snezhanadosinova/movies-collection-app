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

  // Remove overlapping movies from paginated results.
  const popularMovies = uniqueMovies(
    popularQuery.data?.pages.flatMap((page) => page.results) ?? [],
  );

  const discoveredMovies = uniqueMovies(
    discoverQuery.data?.pages.flatMap((page) => page.results) ?? [],
  );

  const movies = isSearching
    ? uniqueMovies(searchQuery.data ?? [])
    : selectedGenre
      ? discoveredMovies
      : popularMovies;

  const isLoading = isSearching
    ? searchQuery.isLoading
    : selectedGenre
      ? discoverQuery.isLoading
      : popularQuery.isLoading;

  const isError = isSearching
    ? searchQuery.isError
    : selectedGenre
      ? discoverQuery.isError
      : popularQuery.isError;

  const hasNextPage = selectedGenre
    ? discoverQuery.hasNextPage
    : popularQuery.hasNextPage;

  const isFetchingNextPage = selectedGenre
    ? discoverQuery.isFetchingNextPage
    : popularQuery.isFetchingNextPage;

  const fetchNextPage = selectedGenre
    ? discoverQuery.fetchNextPage
    : popularQuery.fetchNextPage;

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
    isLoading,
    isError,

    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,

    pageTitle,
  };
};
