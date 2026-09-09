import { Link } from "react-router-dom";

import FavoriteButton from "./FavoriteButton";
import { getTmdbImageUrl } from "@/utils/tmdbImages";

function MovieCard({ movie }) {
  if (!movie?.id) return null;

  const title = movie.title || "Untitled movie";

  const rating = Number.isFinite(movie.vote_average)
    ? movie.vote_average.toFixed(1)
    : "Not rated";

  return (
    <article className="relative min-w-0 rounded-xl bg-zinc-900">
      <Link
        to={`/movies/${movie.id}`}
        className="group block overflow-hidden rounded-xl
                   focus-visible:outline-2 focus-visible:outline-offset-4
                   focus-visible:outline-red-400"
      >
        <div className="h-[400px] overflow-hidden bg-zinc-800">
          {movie.poster_path ? (
            <img
              src={getTmdbImageUrl(movie.poster_path)}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition
                         group-hover:opacity-85"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-4 text-center text-zinc-400">
              Poster unavailable
            </div>
          )}
        </div>

        <div className="p-4">
          <h2 className="line-clamp-1 text-lg font-bold">
            {title}
          </h2>

          <p className="mt-2 text-sm text-zinc-400">
            <span aria-hidden="true">⭐ </span>
            {rating}
          </p>
        </div>
      </Link>

      <div className="absolute right-3 top-3 z-10">
        <FavoriteButton
          movieId={movie.id}
          movieTitle={title}
          compact
        />
      </div>
    </article>
  );
}

export default MovieCard;