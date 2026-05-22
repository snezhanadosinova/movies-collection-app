import { useState } from "react";
import { useSearchMovies } from "@/features/movies/hooks/useSearchMovies";
import { useInfiniteDiscoverMovies } from "@/features/movies/hooks/useInfiniteDiscoverMovies";
import { useInfinitePopularMovies } from "@/features/movies/hooks/useInfinitePopularMovies";
import { useDebounce } from "../../../hooks/useDebounce";

/**
 * Custom hook for managing movie filter state and data
 * Handles search, genre filtering, and determines which data to display
 */
export const useMovieFilter = () => {
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
    const debouncedSearch = useDebounce(search);
  const isSearching = debouncedSearch.trim().length >= 2;

  // Fetch data for all sources
  const popularQuery = useInfinitePopularMovies();
  const searchQuery = useSearchMovies(debouncedSearch);
  const discoverQuery = useInfiniteDiscoverMovies(selectedGenre);

  // Extract movies from paginated results
  const popularMovies = popularQuery.data?.pages.flatMap((page) => page.results) || [];
  const discoveredMovies = discoverQuery.data?.pages.flatMap((page) => page.results) || [];

  // Determine which data to display based on active filter
  const movies = isSearching
    ? searchQuery.data
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

  const hasNextPage = selectedGenre ? discoverQuery.hasNextPage : popularQuery.hasNextPage;
  const isFetchingNextPage = selectedGenre ? discoverQuery.isFetchingNextPage : popularQuery.isFetchingNextPage;
  const fetchNextPage = selectedGenre ? discoverQuery.fetchNextPage : popularQuery.fetchNextPage;

  const pageTitle = isSearching
    ? "Search Results"
    : selectedGenre
      ? `${selectedGenre} Movies`
      : "Popular Movies";

  return {
    // Filter inputs
    search,
    setSearch,
    selectedGenre,
    setSelectedGenre,
    isSearching,

    // Data
    movies,
    isLoading,
    isError,

    // Pagination
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,

    // UI
    pageTitle,
  };
};
