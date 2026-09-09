import { useIsMutating } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import toast from "react-hot-toast";

import { useAuth } from "@/features/auth/context/useAuth";
import { useFavorites } from "@/features/favorites/hooks/useFavorites";
import { useToggleFavorite } from "@/features/favorites/hooks/useToggleFavorite";

export default function FavoriteButton({
  movieId,
  movieTitle,
  compact = false,
}) {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const favoritesQuery = useFavorites();
  const mutation = useToggleFavorite();

  const pendingCount = useIsMutating({
    mutationKey: ["toggle-favorite", user?.uid],
    predicate: (item) => item.state.variables?.movieId === movieId,
  });

  const isFavorite = Boolean(favoritesQuery.data?.[movieId]);
  const isPending = mutation.isPending || pendingCount > 0;
  const isChecking = loading || (Boolean(user) && favoritesQuery.isPending);
  const hasError = Boolean(user) && favoritesQuery.isError;

  const handleClick = () => {
    if (isChecking || isPending) return;

    if (!user) {
      navigate("/login", {
        state: { from: `/movies/${movieId}` },
      });
      return;
    }

    if (hasError) {
      void favoritesQuery.refetch();
      return;
    }

    mutation.mutate(
      { movieId, isFavorite },
      {
        onSuccess: () => {
          toast.success(
            isFavorite ? "Removed from favorites" : "Added to favorites",
          );
        },
        onError: () => {
          toast.error("Could not update favorites. Please try again.");
        },
      },
    );
  };

  const label = isChecking
    ? "Checking favorites..."
    : isPending
      ? "Saving..."
      : hasError
        ? "Retry favorites"
        : isFavorite
          ? "Remove from favorites"
          : "Add to favorites";

  const accessibleLabel = movieTitle ? `${label}: ${movieTitle}` : label;

  const baseClassName =
    "inline-flex items-center justify-center transition " +
    "focus-visible:outline-2 focus-visible:outline-offset-4 " +
    "focus-visible:outline-red-400 " +
    "disabled:cursor-not-allowed disabled:opacity-60";

  const variantClassName = compact
    ? "h-11 w-11 rounded-full bg-black/80 text-white backdrop-blur hover:bg-zinc-800"
    : "min-h-12 w-full gap-3 rounded-xl bg-red-500 px-5 py-3 font-semibold text-white hover:bg-red-600 sm:w-auto sm:min-w-60";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={
        isChecking || isPending || (hasError && favoritesQuery.isFetching)
      }
      aria-label={accessibleLabel}
      aria-pressed={isChecking || hasError ? undefined : isFavorite}
      title={compact ? accessibleLabel : undefined}
      className={`${baseClassName} ${variantClassName}`}
    >
      {isFavorite ? (
        <FaHeart
          aria-hidden="true"
          className={compact ? "text-red-500" : undefined}
        />
      ) : (
        <FaRegHeart aria-hidden="true" />
      )}

      {!compact && <span>{label}</span>}
    </button>
  );
}
