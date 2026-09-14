import { getScrollKey } from "@/utils/scrollReturn";
import { Link, useLocation } from "react-router-dom";
import { getTmdbImageUrl, getTmdbPosterSrcSet } from "@/utils/tmdbImages";

function MediaCard({ title, to, posterPath, voteAverage, action, eager = false, priority = false }) {
  const location = useLocation();
  const rating = Number.isFinite(voteAverage)
    ? voteAverage.toFixed(1)
    : "Not rated";

  return (
    <article className="relative min-w-0 rounded-xl bg-zinc-900">
      <Link
        to={to}
        state={{ fromCatalog: location.pathname + location.search + location.hash, fromCatalogKey: getScrollKey(location) }}
        className="group block overflow-hidden rounded-xl
                   focus-visible:outline-2 focus-visible:outline-offset-4
                   focus-visible:outline-red-400"
      >
        <div className="h-[400px] overflow-hidden bg-zinc-800">
          {posterPath ? (
            <img
              src={getTmdbImageUrl(posterPath)}
              srcSet={getTmdbPosterSrcSet(posterPath)}
              sizes="(min-width: 1280px) 286px, (min-width: 1024px) max(286px, calc((100vw - 136px) / 4)), (min-width: 768px) max(286px, calc((100vw - 96px) / 3)), (min-width: 640px) calc((100vw - 72px) / 2), calc(100vw - 32px)"
              alt=""
              loading={eager ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "auto"}
              width="500" height="750"
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
