import { useInfiniteQuery } from "@tanstack/react-query";

/**
 * Generic infinite query hook factory for paginated movie data
 * @param {string|string[]} queryKey - React Query key
 * @param {function} queryFn - Function that fetches a page of movies
 * @param {object} options - Additional options (enabled, etc.)
 * @returns {UseInfiniteQueryResult} React Query infinite query result
 */
export const useInfiniteMovieQuery = (queryKey, queryFn, options = {}) => {
  return useInfiniteQuery({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    queryFn,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    ...options,
  });
};
