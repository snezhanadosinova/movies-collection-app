import { useQuery } from "@tanstack/react-query";
import { getMovieGenres } from "../api/tmdbApi";

export const useMovieGenres = () => {
  return useQuery({
    queryKey: ["genres"],
    queryFn: getMovieGenres,
    staleTime: Infinity,
  });
};
