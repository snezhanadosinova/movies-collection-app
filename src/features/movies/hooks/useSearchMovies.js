import { useQuery } from "@tanstack/react-query";
import { searchMovies } from "../api/tmdbApi";

export const useSearchMovies = (query) => {
  return useQuery({
    queryKey: ["searchMovies", query],

    queryFn: () => searchMovies(query),

    enabled: !!query,
    placeholderData: (previousData) => previousData,
  });
};
