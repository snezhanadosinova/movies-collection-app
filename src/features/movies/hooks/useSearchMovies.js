import { useQuery } from "@tanstack/react-query";

import { searchMovies } from "../api/tmdbApi";

export const MIN_SEARCH_LENGTH = 3;

export const useSearchMovies = (query) => {
  const normalizedQuery = query.trim();

  return useQuery({
    queryKey: ["searchMovies", normalizedQuery],
    queryFn: ({ signal }) => searchMovies(normalizedQuery, signal),
    enabled: normalizedQuery.length >= MIN_SEARCH_LENGTH,
  });
};
