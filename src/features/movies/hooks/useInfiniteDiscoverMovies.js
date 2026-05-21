import { useInfiniteQuery } from "@tanstack/react-query";

import { discoverMovies } from "../api/tmdbApi";

export const useInfiniteDiscoverMovies = (genre) => {
  return useInfiniteQuery({
    queryKey: ["discover", genre],

    queryFn: ({ pageParam = 1 }) =>
      discoverMovies({
        genre,
        page: pageParam,
      }),

    initialPageParam: 1,

    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }

      return undefined;
    },
  });
};
