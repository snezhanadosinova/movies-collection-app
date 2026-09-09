import { useId, useState } from "react";
import { getTmdbImageUrl } from "@/utils/tmdbImages";

const PAGE_SIZE = 6;

export function MovieCastSection({ cast = [] }) {
  const [page, setPage] = useState(0);
  const listId = useId();

  const uniqueCast = Array.from(
    new Map(cast.map((person) => [person.id, person])).values(),
  );

  const pageCount = Math.ceil(uniqueCast.length / PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(0, pageCount - 1));

  const visibleCast = uniqueCast.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE,
  );

  const navigationClassName =
    "flex h-11 w-11 items-center justify-center rounded-xl " +
    "border border-zinc-700 hover:bg-zinc-800 " +
    "focus-visible:outline-2 focus-visible:outline-red-400 " +
    "disabled:cursor-not-allowed disabled:opacity-30";

  return (
    <section aria-labelledby={`${listId}-heading`}>
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 id={`${listId}-heading`} className="text-2xl font-bold">
          Cast
        </h2>

        {pageCount > 1 && (
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous cast page"
              aria-controls={listId}
              disabled={currentPage === 0}
              onClick={() => setPage(currentPage - 1)}
              className={navigationClassName}
            >
              <span aria-hidden="true">←</span>
            </button>

            <button
              type="button"
              aria-label="Next cast page"
              aria-controls={listId}
              disabled={currentPage >= pageCount - 1}
              onClick={() => setPage(currentPage + 1)}
              className={navigationClassName}
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        )}
      </div>

      {uniqueCast.length === 0 ? (
        <p className="text-zinc-400">Cast information is unavailable.</p>
      ) : (
        <>
          <ul
            id={listId}
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
          >
            {visibleCast.map((person) => (
              <li
                key={person.id}
                className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900"
              >
                <div className="aspect-[2/3] bg-zinc-800">
                  {person.profile_path ? (
                    <img
                      src={getTmdbImageUrl(person.profile_path, "w185")}
                      alt={person.name}
                      loading="lazy"
                      width="185"
                      height="278"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center p-3 text-center text-sm text-zinc-400">
                      Photo unavailable
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <h3 className="line-clamp-2 min-h-10 text-sm font-semibold">
                    {person.name}
                  </h3>

                  <p className="mt-1 line-clamp-2 min-h-10 text-sm text-zinc-400">
                    {person.character || "Role unavailable"}
                  </p>
                </div>
              </li>
            ))}

            {Array.from(
              { length: PAGE_SIZE - visibleCast.length },
              (_, index) => (
                <li key={`empty-${index}`} aria-hidden="true">
                  <div className="aspect-[2/3]" />
                  <div className="h-[108px]" />
                </li>
              ),
            )}
          </ul>

          <p className="mt-4 text-sm text-zinc-400" role="status">
            Page {currentPage + 1} of {pageCount}
          </p>
        </>
      )}
    </section>
  );
}
