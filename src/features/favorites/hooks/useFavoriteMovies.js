import { useQuery } from "@tanstack/react-query";
import { getFavoriteMovies } from "../api/getFavoriteMovies";
import { useFavorites } from "./useFavorites";

export const useFavoriteMovies = () => {
  const { data: favorites = {}, isLoading } = useFavorites();

  return useQuery({
    queryKey: ["favorite-movies", favorites],
    queryFn: () => getFavoriteMovies(favorites),
    enabled: !isLoading,
  });
};
