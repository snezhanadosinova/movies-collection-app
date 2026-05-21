import { useInfiniteQuery } from "@tanstack/react-query";

import { getPopularMovies } from "../api/tmdbApi";

export const useInfinitePopularMovies = () => {
  return useInfiniteQuery({
    queryKey: ["popular-movies"],

    queryFn: ({ pageParam = 1 }) => getPopularMovies(pageParam),

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }

      return undefined;
    },
  });
};
