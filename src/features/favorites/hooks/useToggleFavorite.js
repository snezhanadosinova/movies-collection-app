import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addFavorite, removeFavorite } from "../services/favoritesService";
import { useAuth } from "@/features/auth/context/useAuth";

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const uid = user?.uid;
  const queryKey = ["favorites", uid];
  const mutationKey = ["toggle-favorite", uid];

  return useMutation({
    mutationKey,

    mutationFn: async ({ movieId, isFavorite }) => {
      if (!uid) {
        throw new Error("Please log in first.");
      }

      return isFavorite
        ? removeFavorite(uid, movieId)
        : addFavorite(uid, movieId);
    },

    onMutate: async ({ movieId, isFavorite }) => {
      if (!uid) {
        throw new Error("Please log in first.");
      }

      await queryClient.cancelQueries({
        queryKey,
        exact: true,
      });

      const previous = queryClient.getQueryData(queryKey);
      const wasFavorite = Boolean(previous?.[movieId]);

      queryClient.setQueryData(queryKey, (current = {}) => {
        const next = { ...current };

        if (isFavorite) {
          delete next[movieId];
        } else {
          next[movieId] = true;
        }

        return next;
      });

      return {
        queryKey,
        mutationKey,
        wasFavorite,
      };
    },

    onError: (_error, { movieId }, context) => {
      if (!context) return;

      queryClient.setQueryData(context.queryKey, (current = {}) => {
        const next = { ...current };

        if (context.wasFavorite) {
          next[movieId] = true;
        } else {
          delete next[movieId];
        }

        return next;
      });
    },

    onSettled: (_data, _error, _variables, context) => {
      if (!context) return;

      const pendingCount = queryClient.isMutating({
        mutationKey: context.mutationKey,
        exact: true,
      });

      if (pendingCount === 1) {
        return queryClient.invalidateQueries({
          queryKey: context.queryKey,
          exact: true,
        });
      }
    },
  });
};
