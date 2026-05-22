/**
 * Profile Favorites Preview Component
 */
import { Link } from "react-router-dom";
import { getTmdbImageUrl } from "@/utils/tmdbImages";

export function ProfileFavoritesPreview({ favoriteMovies }) {
  return (
    <div className="mt-8 rounded-xl bg-zinc-900 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">
          Favorites ({favoriteMovies.length})
        </h2>

        <Link
          to="/favorites"
          className="text-sm text-red-400 hover:text-red-300"
        >
          View all →
        </Link>
      </div>

      {favoriteMovies.length === 0 ? (
        <p className="text-zinc-400">No favorites yet 💔</p>
      ) : (
        <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
          {favoriteMovies.slice(0, 6).map((movie) => (
            <Link key={movie.id} to={`/movies/${movie.id}`}>
              <img
                src={getTmdbImageUrl(movie.poster_path, "w200")}
                alt={movie.title}
                className="rounded transition hover:scale-105"
                loading="lazy"
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
