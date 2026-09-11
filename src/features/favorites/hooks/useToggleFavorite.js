import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFavorite, removeFavorite } from "../services/favoritesService";
import { useAuth } from "@/features/auth/context/useAuth";
import { getFavoriteKey } from "../utils/favoriteIdentity";

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const uid = user?.uid;
  const queryKey = ["favorites", uid];
  const mutationKey = ["toggle-favorite", uid];

  return useMutation({
    mutationKey,
    mutationFn: async ({ movieId, isFavorite, mediaType = "movie" }) => {
      if (!uid) throw new Error("Please log in first.");
      const key = getFavoriteKey(movieId, mediaType);
      const storageId = mediaType === "movie" ? movieId : key;
      return isFavorite ? removeFavorite(uid, storageId) : addFavorite(uid, storageId);
    },
    onMutate: async ({ movieId, isFavorite, mediaType = "movie" }) => {
      if (!uid) throw new Error("Please log in first.");
      const key = getFavoriteKey(movieId, mediaType);
      await queryClient.cancelQueries({ queryKey, exact: true });
      const previous = queryClient.getQueryData(queryKey);
      const wasFavorite = previous?.[key] === true;
      queryClient.setQueryData(queryKey, (current = {}) => {
        const next = { ...current };
        if (isFavorite) delete next[key];
        else next[key] = true;
        return next;
      });
      return { queryKey, mutationKey, wasFavorite, key };
    },
    onError: (_error, _variables, context) => {
      if (!context) return;
      queryClient.setQueryData(context.queryKey, (current = {}) => {
        const next = { ...current };
        if (context.wasFavorite) next[context.key] = true;
        else delete next[context.key];
        return next;
      });
    },
    onSettled: (_data, _error, _variables, context) => {
      if (!context) return;
      if (queryClient.isMutating({ mutationKey: context.mutationKey, exact: true }) === 1) {
        return queryClient.invalidateQueries({ queryKey: context.queryKey, exact: true });
      }
    },
  });
};
