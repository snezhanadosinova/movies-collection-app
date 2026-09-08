import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import { getTmdbImageUrl } from "@/utils/tmdbImages";

import { useFavorites } from "@/features/favorites/hooks/useFavorites";
import { useToggleFavorite } from "@/features/favorites/hooks/useToggleFavorite";
import { useAuth } from "@/features/auth/context/useAuth";

function MovieCard({ movie }) {
  const { user } = useAuth();

  const favoritesQuery = useFavorites();

  const favorites = favoritesQuery.data || {};

  const { mutate, isPending } = useToggleFavorite();

  const isFavorite = !!favorites[movie.id];

  const handleFavoriteClick = (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login first");

      return;
    }

    mutate(
      {
        movieId: movie.id,
        isFavorite,
      },
      {
        onSuccess: () => {
          toast.success(
            isFavorite ? "Removed from favorites" : "Added to favorites",
          );
        },

        onError: (error) => {
          console.error(error);

          toast.error("Something went wrong");
        },
      },
    );
  };

  if (!movie?.id) return null;

  return (
    <Link
      to={`/movies/${movie.id}`}
      className="
        group
        relative
        overflow-hidden
        rounded-xl
        bg-zinc-900
        transition
        hover:scale-105
      "
    >
      <button
        onClick={handleFavoriteClick}
        disabled={isPending}
        className="
          absolute
          top-3
          right-3
          z-10
          rounded-full
          bg-black/70
          p-2
          text-white
          backdrop-blur
          transition
          hover:scale-110
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        {isFavorite ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
      </button>

      <img
        src={getTmdbImageUrl(movie.poster_path)}
        alt={movie.title}
        className="
          h-[400px]
          w-full
          object-cover
        "
        loading="lazy"
      />

      <div className="p-4">
        <h2 className="line-clamp-1 text-lg font-bold">{movie.title}</h2>

        <p className="mt-2 text-sm text-zinc-400">
          ⭐ {movie.vote_average.toFixed(1)}
        </p>
      </div>
    </Link>
  );
}

export default MovieCard;
