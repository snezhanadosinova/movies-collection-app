import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import { searchMovies } from "../api/tmdbApi";

export const MIN_SEARCH_LENGTH = 2;
export const SEARCH_PAGE_LIMIT = 5;

export const useSearchMovies = (query) => {
  const normalizedQuery = query.trim();
  const enabled = normalizedQuery.length >= MIN_SEARCH_LENGTH;

  const searchQuery = useInfiniteQuery({
    queryKey: ["searchMovies", "infinite", normalizedQuery],
    queryFn: ({ signal, pageParam }) =>
      searchMovies(normalizedQuery, signal, pageParam),
    initialPageParam: 1,
    enabled,

    getNextPageParam: (lastPage, pages) => {
      if (
        pages.length >= SEARCH_PAGE_LIMIT ||
        lastPage.page >= lastPage.total_pages
      ) {
        return undefined;
      }

      return lastPage.page + 1;
    },
  });

  const { fetchNextPage, hasNextPage, isFetching, isError, fetchStatus } =
    searchQuery;

  const pages = searchQuery.data?.pages;
  const pageCount = pages?.length ?? 0;
  const lastPage = pages?.at(-1);

  useEffect(() => {
    if (
      enabled &&
      hasNextPage &&
      !isFetching &&
      !isError &&
      fetchStatus !== "paused"
    ) {
      void fetchNextPage({ cancelRefetch: false });
    }
  }, [
    enabled,
    normalizedQuery,
    pageCount,
    hasNextPage,
    isFetching,
    isError,
    fetchStatus,
    fetchNextPage,
  ]);

  const searchLimitReached = Boolean(
    lastPage &&
    pageCount >= SEARCH_PAGE_LIMIT &&
    lastPage.page < lastPage.total_pages,
  );

  const isSearchingMore = Boolean(
    enabled &&
    pageCount > 0 &&
    !isError &&
    (hasNextPage || searchQuery.isFetchingNextPage),
  );

  return {
    ...searchQuery,

    // Preserve the array interface expected by useMovieFilter.
    data: pages?.flatMap((page) => page.results),

    isSearchingMore,
    searchLimitReached,
    isSearchPaused: enabled && fetchStatus === "paused",
  };
};
