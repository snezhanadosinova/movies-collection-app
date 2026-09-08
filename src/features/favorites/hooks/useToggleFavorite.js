import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addFavorite, removeFavorite } from "../services/favoritesService";

import { useAuth } from "../../auth/context/useAuth";

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ movieId, isFavorite }) => {
      if (isFavorite) {
        return removeFavorite(user.uid, movieId);
      }

      return addFavorite(user.uid, movieId);
    },

    // 🔥 OPTIMISTIC UPDATE
    onMutate: async ({ movieId, isFavorite }) => {
      await queryClient.cancelQueries(["favorites", user.uid]);

      const previous = queryClient.getQueryData(["favorites", user.uid]);

      const newFavorites = { ...(previous || {}) };

      if (isFavorite) {
        delete newFavorites[movieId];
      } else {
        newFavorites[movieId] = true;
      }

      queryClient.setQueryData(["favorites", user.uid], newFavorites);

      return { previous };
    },

    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["favorites", user.uid], context.previous);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorite-movies"],
      });

      queryClient.invalidateQueries({
        queryKey: ["favorites", user.uid],
      });
    },
  });
};
