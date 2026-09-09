import { Link } from "react-router-dom";
import { getTmdbImageUrl } from "@/utils/tmdbImages";

export function MovieSimilarSection({ similar = [] }) {
  return (
    <section aria-labelledby="related-heading">
      <h2 id="related-heading" className="text-2xl font-bold">
        More like this
      </h2>

      <p className="mt-2 text-sm text-zinc-400">Suggestions from TMDB</p>

      {similar.length === 0 ? (
        <p className="mt-5 text-zinc-400">No suggestions are available yet.</p>
      ) : (
        <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {similar.map((movie) => (
            <li key={movie.id}>
              <Link
                to={`/movies/${movie.id}`}
                className="group block rounded-xl
                           focus-visible:outline-2
                           focus-visible:outline-offset-4
                           focus-visible:outline-red-400"
              >
                <div className="aspect-[2/3] overflow-hidden rounded-xl bg-zinc-900">
                  {movie.poster_path ? (
                    <img
                      src={getTmdbImageUrl(movie.poster_path)}
                      alt=""
                      loading="lazy"
                      width="500"
                      height="750"
                      className="h-full w-full object-cover transition
                                 group-hover:opacity-80"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center p-3 text-center text-sm text-zinc-400">
                      Poster unavailable
                    </div>
                  )}
                </div>

                <h3 className="mt-3 line-clamp-2 text-sm font-semibold">
                  {movie.title || "Untitled movie"}
                </h3>

                <p className="mt-1 text-sm text-zinc-400">
                  {movie.release_date?.slice(0, 4) || "Year unavailable"}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
