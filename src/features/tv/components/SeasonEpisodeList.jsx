import { useState } from "react";
import EpisodeCard from "./EpisodeCard";

const PAGE_SIZE = 10;

export default function SeasonEpisodeList({ episodes }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const shownCount = Math.min(visibleCount, episodes.length);
  const hasMore = shownCount < episodes.length;

  return (
    <>
      <ol id="season-episode-list" className="space-y-5">
        {episodes.slice(0, visibleCount).map((episode) => (
          <li key={episode.id ?? episode.episode_number}>
            <EpisodeCard episode={episode} />
          </li>
        ))}
      </ol>
      <div className="mt-8 flex flex-col items-center gap-3">
        <p role="status" aria-live="polite" aria-atomic="true" className="text-sm text-zinc-400">
          Showing {shownCount} of {episodes.length} episodes
        </p>
        {episodes.length > PAGE_SIZE && (
          <button
            type="button"
            aria-controls="season-episode-list"
            aria-disabled={!hasMore}
            onClick={() => {
              if (hasMore) setVisibleCount((count) => count + PAGE_SIZE);
            }}
            className="min-h-11 rounded-xl bg-red-500 px-6 py-3 font-semibold text-white hover:bg-red-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-400 aria-disabled:cursor-default aria-disabled:bg-zinc-800 aria-disabled:text-zinc-400"
          >
            {hasMore ? "Load more episodes" : "All episodes loaded"}
          </button>
        )}
      </div>
    </>
  );
}
