import { useId } from "react";

import { useMovieGenres } from "@/features/movies/hooks/useMovieGenres";

function GenreFilter({ value, onChange }) {
  const selectId = useId();
  const statusId = useId();

  const {
    data: genres = [],
    isPending,
    isError,
    isFetching,
    refetch,
  } = useMovieGenres();

  const hasSelectedGenre = genres.some(
    (genre) => String(genre.id) === String(value),
  );

  const showFallbackOption = Boolean(value) && !hasSelectedGenre;

  let statusMessage = "";

  if (isPending) {
    statusMessage = "Loading genres...";
  } else if (isError) {
    statusMessage =
      genres.length > 0
        ? "Could not refresh genres."
        : "Could not load genres.";
  }

  return (
    <div className="w-full md:w-64">
      <label
        htmlFor={selectId}
        className="mb-2 block text-sm font-medium text-zinc-200"
      >
        Genre
      </label>

      <select
        id={selectId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-describedby={statusMessage ? statusId : undefined}
        aria-busy={Boolean(isFetching)}
        className="
          min-h-12 w-full rounded-xl border border-zinc-700
          bg-zinc-900 px-4 py-3 text-white
          focus-visible:outline-2 focus-visible:outline-offset-2
          focus-visible:outline-red-400
        "
      >
        <option value="">All Genres</option>

        {showFallbackOption && (
          <option value={value} disabled>
            Selected genre
          </option>
        )}

        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>

      <div className="mt-2 flex min-h-11 items-start gap-2">
        <p id={statusId} role="status" className="flex-1 text-sm text-zinc-400">
          {statusMessage}
        </p>

        {isError && (
          <button
            type="button"
            onClick={() => refetch({ cancelRefetch: false })}
            disabled={isFetching}
            aria-label="Retry loading genres"
            className="
              min-h-11 shrink-0 rounded-lg px-2 text-sm text-red-400
              underline underline-offset-4
              focus-visible:outline-2 focus-visible:outline-offset-2
              focus-visible:outline-red-400
              disabled:cursor-wait disabled:opacity-50
            "
          >
            {isFetching ? "Retrying..." : "Retry"}
          </button>
        )}
      </div>
    </div>
  );
}

export default GenreFilter;
