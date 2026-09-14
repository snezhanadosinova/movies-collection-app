import { useId } from "react";
import { Link } from "react-router-dom";
import { getTmdbImageUrl } from "@/utils/tmdbImages";

const controlClass = "inline-flex min-h-11 items-center rounded px-2 text-sm text-red-300 hover:text-red-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 disabled:opacity-50";

export function ProfileFavoritesPreview({ favoriteMovies = [], slots, loading = false, isError = false, isFetching = false, onRetry }) {
  const headingId = useId();
  const entries = slots ?? favoriteMovies.map((item) => ({ id: item.id, media_type: item.media_type, item }));
  const initialLoading = loading && entries.length === 0;
  const pending = initialLoading || entries.some((entry) => entry.isPending);
  const visible = initialLoading
    ? Array.from({ length: 6 }, (_, index) => ({ id: `loading-${index}`, isPending: true }))
    : entries.slice(0, 6);

  return (
    <section aria-labelledby={headingId} className="mt-8 rounded-xl bg-zinc-900 p-6">
      <div className="mb-4 flex min-h-11 flex-wrap items-center justify-between gap-2">
        <h2 id={headingId} className="text-xl font-bold">
          {initialLoading ? "Favorites" : `Favorites (${entries.length})`}
        </h2>
        <Link to="/favorites" className={controlClass}>View all <span aria-hidden="true">→</span></Link>
      </div>
      {visible.length > 0 && (
        <ul className="grid grid-cols-3 gap-4 md:grid-cols-6">
          {visible.map((entry) => {
            const item = entry.item;
            const isTv = entry.media_type === "tv";
            const title = item && ((isTv ? item.name : item.title) || "Unavailable title");
            return (
              <li key={`${entry.media_type || "movie"}:${entry.id}`}>
                {item ? (
                  <Link to={`/${isTv ? "tv" : "movies"}/${entry.id}`} aria-label={title}
                    className="block rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400">
                    <div className="aspect-[2/3] overflow-hidden rounded bg-zinc-800">
                      {item.poster_path ? (
                        <img src={getTmdbImageUrl(item.poster_path, "w200")} alt="" loading="lazy"
                          width="200" height="300" className="h-full w-full object-cover" />
                      ) : <span className="flex h-full items-center justify-center p-2 text-center text-xs text-zinc-300">{title}</span>}
                    </div>
                  </Link>
                ) : (
                  <div className={"flex aspect-[2/3] items-center justify-center rounded bg-zinc-800 p-2 text-center text-xs text-zinc-300 " + (entry.isPending ? "skeleton-pulse" : "")}
                    aria-hidden={entry.isPending ? "true" : undefined}>
                    {entry.isError ? "Could not load title" : null}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {!pending && !isError && entries.length === 0 && <p className="text-zinc-400">No favorites yet 💔</p>}
      <div role="status" className="sr-only">{pending ? "Loading favorites..." : ""}</div>
      {isError && (
        <div className="mt-4">
          <p role="alert" className="text-sm text-amber-300">Could not load all favorites. Available titles are shown above.</p>
          <button type="button" onClick={onRetry} disabled={isFetching} className={controlClass}>
            {isFetching ? "Retrying..." : "Retry favorites"}
          </button>
        </div>
      )}
    </section>
  );
}
