import { useState } from "react";

export function MovieTrailerSection({ trailer }) {
  const [playing, setPlaying] = useState(false);

  if (!trailer) return null;

  return (
    <section aria-labelledby="trailer-heading">
      <h2 id="trailer-heading" className="mb-4 text-2xl font-bold">
        Official trailer
      </h2>

      <div className="aspect-video overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1`}
            title={trailer.name || "Movie trailer"}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="h-full w-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="flex h-full w-full flex-col items-center justify-center
                       gap-3 p-4 text-center transition hover:bg-zinc-800
                       focus-visible:outline-2 focus-visible:outline-inset
                       focus-visible:outline-red-400"
          >
            <span
              aria-hidden="true"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-2xl"
            >
              ▶
            </span>

            <span className="font-semibold">Play trailer</span>
            <span className="text-sm text-zinc-400">
              Loads the YouTube player
            </span>
          </button>
        )}
      </div>
    </section>
  );
}
