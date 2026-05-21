import { useQuery } from "@tanstack/react-query";
import { getMovieDetails } from "../api/tmdbApi";

export const useMovieDetails = (id) => {
  return useQuery({
    queryKey: ["movie", id],

    queryFn: () => getMovieDetails(id),

    enabled: !!id,
  });
};
