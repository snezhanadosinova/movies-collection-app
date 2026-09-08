import { useQuery } from "@tanstack/react-query";
import { getFavoriteMovies } from "../api/getFavoriteMovies";
import { useFavorites } from "./useFavorites";

export const useFavoriteMovies = () => {
  const favoritesQuery = useFavorites();

  const moviesQuery = useQuery({
    queryKey: ["favorite-movies", favoritesQuery.data],
    queryFn: () => getFavoriteMovies(favoritesQuery.data),
    enabled: favoritesQuery.isSuccess,
  });

  return {
    data: moviesQuery.data,
    isLoading:
      favoritesQuery.isPending ||
      (favoritesQuery.isSuccess && moviesQuery.isPending),
    isError: favoritesQuery.isError || moviesQuery.isError,
    error: favoritesQuery.error ?? moviesQuery.error,
  };
};
