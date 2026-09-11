import { Link } from "react-router-dom";
import { getTmdbImageUrl } from "@/utils/tmdbImages";

export function ProfileFavoritesPreview({ favoriteMovies }) {
  return (
    <div className="mt-8 rounded-xl bg-zinc-900 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Favorites ({favoriteMovies.length})</h2>
        <Link to="/favorites" className="text-sm text-red-400 hover:text-red-300">View all →</Link>
      </div>
      {favoriteMovies.length === 0 ? <p className="text-zinc-400">No favorites yet 💔</p> : (
        <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
          {favoriteMovies.slice(0, 6).map((item) => {
            const isTv = item.media_type === "tv";
            const title = (isTv ? item.name : item.title) || "Unavailable title";
            return (
              <Link key={`${isTv ? "tv" : "movie"}:${item.id}`}
                to={`/${isTv ? "tv" : "movies"}/${item.id}`}
                aria-label={title} className="block rounded focus-visible:outline-2 focus-visible:outline-red-400">
                <div className="aspect-[2/3] overflow-hidden rounded bg-zinc-800">
                  {item.poster_path ? (
                    <img src={getTmdbImageUrl(item.poster_path, "w200")} alt="" loading="lazy"
                      className="h-full w-full object-cover" />
                  ) : <span className="flex h-full items-center justify-center p-2 text-center text-xs text-zinc-400">{title}</span>}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
