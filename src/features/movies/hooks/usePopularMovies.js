import { useQuery } from "@tanstack/react-query";
import { getPopularMovies } from "../api/tmdbApi";

export const usePopularMovies = () => {
  return useQuery({
    queryKey: ["popularMovies"],
    queryFn: () => getPopularMovies(),
  });
};
