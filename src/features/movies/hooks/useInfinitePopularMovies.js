import { useInfiniteMovieQuery } from "@/hooks/useInfiniteMovieQuery";
import { getPopularMovies } from "../api/tmdbApi";

export const useInfinitePopularMovies = ({ enabled = true } = {}) => {
  return useInfiniteMovieQuery(["popularMovies"], ({ pageParam = 1 }) =>
    getPopularMovies(pageParam),
    { enabled },
  );
};
