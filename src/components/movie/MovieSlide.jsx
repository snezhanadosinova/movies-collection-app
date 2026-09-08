import { useNavigate } from "react-router-dom";

import { getTmdbBackdropUrl, getTmdbBackdropSrcSet } from "@/utils/tmdbImages";

export default function MovieSlide({ movie, genreMap, priority = false }) {
  const navigate = useNavigate();

  return (
    <div className="relative h-[75vh] w-full overflow-hidden rounded-2xl bg-zinc-900">
      {movie.backdrop_path && (
        <img
          src={getTmdbBackdropUrl(movie.backdrop_path)}
          srcSet={getTmdbBackdropSrcSet(movie.backdrop_path)}
          sizes="(min-width: 1280px) 1200px, calc(100vw - 80px)"
          alt={movie.title}
          className="absolute inset-0 h-full w-full object-cover"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
        />
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-black via-black/50 to-transparent" />

      {/* Slide content */}
      <div className="relative z-10 flex h-full items-center px-8 md:px-20">
        <div className="max-w-2xl text-white">
          <h1 className="mb-4 text-3xl font-bold md:text-7xl">{movie.title}</h1>

          <p className="mb-6 line-clamp-2 text-lg leading-relaxed text-gray-300">
            {movie.overview}
          </p>

          <div className="my-4 flex flex-wrap gap-3">
            {(movie.genre_ids ?? []).map((genreId) => (
              <span
                key={genreId}
                className="inline-flex items-center gap-x-1.5 rounded-full bg-red-500 px-2 py-1 text-xs font-medium text-white"
              >
                {genreMap[genreId]}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={() => navigate(`/movies/${movie.id}`)}
            className="rounded-lg border-2 border-red-500 px-8 py-4 font-semibold text-red-500 transition hover:bg-red-500 hover:text-black"
          >
            More Details
          </button>
        </div>
      </div>
    </div>
  );
}
