import { queueFavoriteRequest } from "../utils/requestQueue";
import { useQueries } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/context/useAuth";
import { getFavoriteMediaItem } from "../api/getFavoriteMovies";
import { getFavoriteEntries } from "../utils/favoriteIdentity";
import { useFavorites } from "./useFavorites";

// Kept under the existing name for compatibility with the profile page.
export const useFavoriteMovies = () => {
  const { user } = useAuth();
  const favoritesQuery = useFavorites();
  const entries = user ? getFavoriteEntries(favoritesQuery.data) : [];
  const queries = useQueries({
    queries: entries.map((entry) => ({
      queryKey: ["favorite-media", user.uid, entry.mediaType, entry.id],
      queryFn: ({ signal }) => queueFavoriteRequest(() => getFavoriteMediaItem(entry, signal), signal),
      enabled: favoritesQuery.isSuccess,
    })),
  });
  const data = queries.flatMap((query) => query.data ? [query.data] : []);
  const isFetching = favoritesQuery.isFetching || queries.some((query) => query.isFetching);
  const isError = favoritesQuery.isError || queries.some((query) => query.isError);

  return {
    data,
    slots: entries.map((entry, index) => ({
      id: entry.id,
      media_type: entry.mediaType,
      item: queries[index].data,
      isPending: queries[index].isPending,
      isError: queries[index].isError,
    })),
    isLoading: favoritesQuery.isPending ||
      (data.length === 0 && queries.some((query) => query.isPending)),
    isFetching,
    isError,
    error: favoritesQuery.error ?? queries.find((query) => query.error)?.error,
    refetch: () => Promise.all([
      favoritesQuery.refetch(),
      ...queries.filter((query) => query.isError).map((query) => query.refetch()),
    ]),
  };
};
