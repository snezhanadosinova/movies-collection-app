import { useQuery } from "@tanstack/react-query";

import { discoverMovies } from "../api/tmdbApi";

export const useDiscoverMovies = (genre) => {
  return useQuery({
    queryKey: ["discover", genre],
    queryFn: () =>
      discoverMovies({
        genre,
      }),
  });
};
