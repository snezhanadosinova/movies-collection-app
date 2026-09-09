import FavoriteButton from "@/components/movie/FavoriteButton";
import { getTmdbBackdropUrl, getTmdbImageUrl } from "@/utils/tmdbImages";

export function MovieHeroSection({ movie, loading = false }) {
  const title = movie?.title || "Untitled movie";
  const genres = movie?.genres ?? [];

  const rating =
    Number.isFinite(movie?.vote_average) && movie.vote_count > 0
      ? `${movie.vote_average.toFixed(1)} / 10`
      : "Not rated";

  const runtime =
    Number.isFinite(movie?.runtime) && movie.runtime > 0
      ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
      : "Runtime unavailable";

  const year = movie?.release_date?.slice(0, 4) || "Year unavailable";

  const directors = [
    ...new Set(
      (movie?.credits?.crew ?? [])
        .filter((person) => person.job === "Director")
        .map((person) => person.name),
    ),
  ];

  return (
    <section className="relative isolate overflow-hidden bg-zinc-950">
      {!loading && movie?.backdrop_path && (
        <img
          src={getTmdbBackdropUrl(movie.backdrop_path)}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
      )}

      <div className="absolute inset-0 -z-10 bg-linear-to-t from-black via-black/85 to-black/60" />

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10 lg:px-8 lg:py-14">
        <div className="mx-auto aspect-[2/3] w-36 overflow-hidden rounded-2xl bg-zinc-800 shadow-xl sm:w-44 lg:mx-0 lg:w-full">
          {loading ? (
            <div className="h-full animate-pulse bg-zinc-800 motion-reduce:animate-none" />
          ) : movie?.poster_path ? (
            <img
              src={getTmdbImageUrl(movie.poster_path)}
              alt={`${title} poster`}
              width="500"
              height="750"
              loading="eager"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-4 text-center text-sm text-zinc-400">
              Poster unavailable
            </div>
          )}
        </div>

        <div className="min-w-0 self-center">
          {loading ? (
            <div role="status" aria-label="Loading movie">
              <span className="sr-only">Loading movie...</span>

              <div
                aria-hidden="true"
                className="space-y-5 animate-pulse motion-reduce:animate-none"
              >
                <div className="h-5 w-40 rounded bg-zinc-800" />
                <div className="h-12 w-4/5 rounded bg-zinc-800" />
                <div className="h-7 w-2/3 rounded bg-zinc-800" />
                <div className="h-24 rounded bg-zinc-800" />
                <div className="h-12 w-full rounded-xl bg-zinc-800 sm:w-60" />
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm font-medium tracking-wide text-zinc-300">
                {year} · {runtime}
              </p>

              <h1 className="mt-3 break-words text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {title}
              </h1>

              {movie.tagline && (
                <p className="mt-3 text-lg italic text-zinc-300">
                  {movie.tagline}
                </p>
              )}

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-amber-400/15 px-3 py-1 text-sm font-semibold text-amber-300">
                  ★ {rating}
                </span>

                {genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full border border-white/15 px-3 py-1 text-sm text-zinc-200"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              <h2 className="mt-6 text-lg font-semibold">Overview</h2>

              <p className="mt-2 max-w-3xl leading-relaxed text-zinc-300">
                {movie.overview || "An overview is not available yet."}
              </p>

              {directors.length > 0 && (
                <p className="mt-4 text-sm text-zinc-300">
                  <span className="font-semibold text-white">Directed by:</span>{" "}
                  {directors.join(", ")}
                </p>
              )}

              <div className="mt-6">
                <FavoriteButton movieId={movie.id} />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
