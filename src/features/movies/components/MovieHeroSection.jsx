/**
 * Movie Hero Section Component
 */
import { getTmdbBackdropUrl, getTmdbImageUrl } from "@/utils/tmdbImages";

export function MovieHeroSection({ movie }) {
  return (
    <div
      className="relative h-[500px] bg-cover bg-center"
      style={{
        backgroundImage: `url(${getTmdbBackdropUrl(movie.backdrop_path)})`,
      }}
    >
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative mx-auto flex h-full max-w-7xl items-end gap-10 p-10">
        <img
          src={getTmdbImageUrl(movie.poster_path)}
          alt={movie.title}
          className="hidden w-[300px] rounded-xl md:block"
          loading="lazy"
        />

        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold">{movie.title}</h1>

          <div className="mt-4 flex flex-wrap gap-3">
            {movie.genres?.map((genre) => (
              <span
                key={genre.id}
                className="rounded-full bg-red-500 px-4 py-2 text-sm"
              >
                {genre.name}
              </span>
            ))}
          </div>

          <p className="mt-6 text-zinc-300">{movie.overview}</p>

          <div className="mt-6 flex gap-6 text-lg">
            <p>⭐ {movie.vote_average?.toFixed(1)}</p>
            <p>⏱ {movie.runtime} min</p>
            <p>📅 {movie.release_date}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
