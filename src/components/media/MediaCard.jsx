import { Link } from "react-router-dom";
import { getTmdbImageUrl } from "@/utils/tmdbImages";

function MediaCard({ title, to, posterPath, voteAverage, action }) {
  const rating = Number.isFinite(voteAverage)
    ? voteAverage.toFixed(1)
    : "Not rated";

  return (
    <article className="relative min-w-0 rounded-xl bg-zinc-900">
      <Link
        to={to}
        className="group block overflow-hidden rounded-xl
                   focus-visible:outline-2 focus-visible:outline-offset-4
                   focus-visible:outline-red-400"
      >
        <div className="h-[400px] overflow-hidden bg-zinc-800">
          {posterPath ? (
            <img
              src={getTmdbImageUrl(posterPath)}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition group-hover:opacity-85"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-4 text-center text-zinc-400">
              Poster unavailable
            </div>
          )}
        </div>
        <div className="p-4">
          <h2 className="line-clamp-1 text-lg font-bold">{title}</h2>
          <p className="mt-2 text-sm text-zinc-400">
            <span aria-hidden="true">⭐ </span>
            {rating}
          </p>
        </div>
      </Link>
      {action && <div className="absolute right-3 top-3 z-10">{action}</div>}
    </article>
  );
}

export default MediaCard;
