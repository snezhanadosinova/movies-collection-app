import { useInfiniteMovieQuery } from "@/hooks/useInfiniteMovieQuery";
import { discoverMovies } from "../api/tmdbApi";

export const useInfiniteDiscoverMovies = (genre, { enabled = true } = {}) => {
  return useInfiniteMovieQuery(
    ["discoverMovies", genre],
    ({ pageParam = 1 }) =>
      discoverMovies({
        genre,
        page: pageParam,
      }),
    { enabled: enabled && !!genre },
  );
};
