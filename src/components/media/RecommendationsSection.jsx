import { useId } from "react";
import { Link } from "react-router-dom";
import { getTmdbImageUrl } from "@/utils/tmdbImages";

const PAGE_SIZE = 6;

export default function RecommendationsSection({ items = [], mediaType = "movie", title = "More like this", description = "Suggestions from TMDB" }) {
  const sectionId = useId();
  const visibleItems = items.slice(0, PAGE_SIZE);
  const isTv = mediaType === "tv";

  return (
    <section aria-labelledby={sectionId + "-heading"}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 id={sectionId + "-heading"} className="text-2xl font-bold">{title}</h2>
          <p className="mt-2 text-sm text-zinc-400">{description}</p>
        </div>
      </div>
      {items.length === 0 ? (
        <p className="mt-5 text-zinc-400">No suggestions are available yet.</p>
      ) : (
        <ul id={sectionId} className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {visibleItems.map((item) => (
            <li key={item.id}>
              <Link to={`/${isTv ? "tv" : "movies"}/${item.id}`}
                className="group block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-400">
                <div className="aspect-[2/3] overflow-hidden rounded-xl bg-zinc-900">
                  {item.poster_path ? (
                    <img src={getTmdbImageUrl(item.poster_path, "w342")} alt=""
                      loading="lazy" width="342" height="513"
                      className="h-full w-full object-cover transition-opacity group-hover:opacity-80" />
                  ) : (
                    <div className="flex h-full items-center justify-center p-3 text-center text-sm text-zinc-400">Poster unavailable</div>
                  )}
                </div>
                <h3 className="mt-3 line-clamp-2 min-h-10 text-sm font-semibold">
                  {(isTv ? item.name : item.title) || (isTv ? "Untitled series" : "Untitled movie")}
                </h3>
                <p className="mt-1 text-sm text-zinc-400">
                  {(isTv ? item.first_air_date : item.release_date)?.slice(0, 4) || "Year unavailable"}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
