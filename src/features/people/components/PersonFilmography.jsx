import { useId, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getTmdbImageUrl } from "@/utils/tmdbImages";
import { getPersonCredits } from "../utils/personDetails";

const PAGE_SIZE = 8;

const controlClassName =
  "min-h-11 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 " +
  "text-white focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-red-400";

export function PersonFilmography({ credits }) {
  const [search, setSearch] = useState("");
  const [mediaType, setMediaType] = useState("all");
  const [page, setPage] = useState(0);
  const inputId = useId();
  const selectId = useId();
  const headingId = useId();

  const titles = useMemo(() => getPersonCredits(credits), [credits]);

  const filteredTitles = titles.filter(
    (title) =>
      (mediaType === "all" || title.mediaType === mediaType) &&
      title.title.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const pageCount = Math.ceil(filteredTitles.length / PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(0, pageCount - 1));

  const visibleTitles = filteredTitles.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE,
  );

  return (
    <section aria-labelledby={headingId}>
      <div className="mb-6">
        <h2 id={headingId} className="text-2xl font-bold">
          Filmography
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          Acting and crew credits, newest first. Dates for series refer to
          the first air date.
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-[1fr_180px]">
        <div>
          <label htmlFor={inputId} className="mb-2 block text-sm">
            Search filmography
          </label>
          <input
            id={inputId}
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(0);
            }}
            className={`${controlClassName} w-full`}
          />
        </div>

        <div>
          <label htmlFor={selectId} className="mb-2 block text-sm">
            Title type
          </label>
          <select
            id={selectId}
            value={mediaType}
            onChange={(event) => {
              setMediaType(event.target.value);
              setPage(0);
            }}
            className={`${controlClassName} w-full`}
          >
            <option value="all">All titles</option>
            <option value="movie">Movies</option>
            <option value="tv">TV series</option>
          </select>
        </div>
      </div>

      <p role="status" className="mb-4 text-sm text-zinc-400">
        {filteredTitles.length} titles
      </p>

      {visibleTitles.length === 0 ? (
        <p className="rounded-xl border border-zinc-800 p-6 text-zinc-400">
          {titles.length === 0
            ? "Filmography is unavailable."
            : "No titles match these filters."}
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {visibleTitles.map((title) => {
            const content = (
              <>
                <div className="aspect-[2/3] overflow-hidden bg-zinc-800">
                  {title.posterPath ? (
                    <img
                      src={getTmdbImageUrl(title.posterPath, "w342")}
                      alt=""
                      loading="lazy"
                      width="342"
                      height="513"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center p-4 text-center text-sm text-zinc-400">
                      Poster unavailable
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <p className="text-xs text-zinc-400">
                    {title.mediaType === "movie" ? "Movie" : "TV series"}
                    {" · "}
                    {title.date.slice(0, 4) || "Date unavailable"}
                  </p>
                  <h3 className="mt-2 font-semibold">{title.title}</h3>
                </div>
              </>
            );

            const linkClassName =
              "block rounded-t-xl focus-visible:outline-2 " +
              "focus-visible:outline-offset-2 focus-visible:outline-red-400";

            return (
              <li
                key={title.key}
                className="rounded-xl border border-zinc-800 bg-zinc-900"
              >
                {title.mediaType === "movie" ? (
                  <Link
                    to={`/movies/${title.id}`}
                    className={linkClassName}
                  >
                    {content}
                  </Link>
                ) : (
                  <a
                    href={`https://www.themoviedb.org/tv/${title.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClassName}
                    aria-label={`${title.title} on TMDB (opens in a new tab)`}
                  >
                    {content}
                  </a>
                )}

                <p className="px-3 pb-4 text-sm text-zinc-400">
                  {title.roles.join(" · ")}
                </p>
              </li>
            );
          })}
        </ul>
      )}

      {pageCount > 1 && (
        <nav
          aria-label="Filmography pages"
          className="mt-6 flex items-center justify-between gap-3"
        >
          <button
            type="button"
            disabled={currentPage === 0}
            onClick={() => setPage(currentPage - 1)}
            className={`${controlClassName} disabled:opacity-40`}
          >
            Previous
          </button>

          <span className="text-sm text-zinc-400" role="status">
            Page {currentPage + 1} of {pageCount}
          </span>

          <button
            type="button"
            disabled={currentPage === pageCount - 1}
            onClick={() => setPage(currentPage + 1)}
            className={`${controlClassName} disabled:opacity-40`}
          >
            Next
          </button>
        </nav>
      )}
    </section>
  );
}