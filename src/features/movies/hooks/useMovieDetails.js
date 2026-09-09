import { useQuery } from "@tanstack/react-query";

import { getMovieDetails } from "../api/tmdbApi";

export const useMovieDetails = (id) => {
  const isValidId = /^[1-9]\d*$/.test(String(id ?? ""));

  const query = useQuery({
    queryKey: ["movie", id],
    queryFn: ({ signal }) => getMovieDetails(id, signal),
    enabled: isValidId,
    retry: (failureCount, error) => {
      const status = error.response?.status;

      if (status >= 400 && status < 500 && status !== 429) {
        return false;
      }

      return failureCount < 1;
    },
  });

  return {
    ...query,
    isInvalidId: !isValidId,
  };
};
