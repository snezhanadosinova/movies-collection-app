import { getTmdbImageUrl } from "@/utils/tmdbImages";
import { formatTvDate } from "../utils/tvDetails";

export default function EpisodeCard({ episode }) {
  const hasRating =
    Number.isFinite(episode.vote_average) && episode.vote_count > 0;
  const runtime =
    Number.isFinite(episode.runtime) && episode.runtime > 0
      ? `${episode.runtime} min`
      : "Runtime unavailable";

  return (
    <article className="grid gap-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:grid-cols-[240px_1fr] sm:p-5">
      <div className="aspect-video self-start overflow-hidden rounded-xl bg-zinc-800">
        {episode.still_path ? (
          <img
            src={getTmdbImageUrl(episode.still_path, "w300")}
            alt=""
            loading="lazy"
            width="300"
            height="169"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-400">
            Image unavailable
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-red-400 flex justify-content-start gap-2">
          <span>Episode {episode.episode_number} </span> {hasRating ? (
              <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-xs text-amber-300">
                ★ {episode.vote_average.toFixed(1)} / 10
              </span>
            ) : (
              <span className="rounded-full bg-gray-400/15 px-2 py-0.5 text-xs text-gray-300">Not rated</span>
            )}
        </p>
        <h3 className="mt-1 text-xl font-semibold">
          {episode.name || "Untitled episode"}
        </h3>
        <ul
          aria-label="Episode information"
          className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-zinc-400"
        >
          <li>{formatTvDate(episode.air_date)}</li>
          <li>{runtime}</li>

        </ul>
        <p className="mt-4 whitespace-pre-line leading-7 text-zinc-300">
          {episode.overview || "Overview is unavailable."}
        </p>
      </div>
    </article>
  );
}
