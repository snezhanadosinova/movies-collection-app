import { useNavigate } from "react-router";
import { getTmdbBackdropUrl } from "@/utils/tmdbImages";

export default function MovieSlide({ movie, genreMap }) {
  const navigate = useNavigate();

  return (
    <div className="relative h-[75vh] w-full overflow-hidden rounded-2xl">
      <img
        src={getTmdbBackdropUrl(movie.backdrop_path)}
        alt={movie.title}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Gradient */}
      <div className="absolute inset-0 bg-linear-to-r from-black via-black/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center px-8 md:px-20">
        <div className="max-w-2xl text-white">
          <h1 className="mb-4 text-3xl font-bold md:text-7xl">{movie.title}</h1>

          <p className="mb-6 text-lg text-gray-300 leading-relaxed line-clamp-2">
            {movie.overview}
          </p>
          <div className="flex flex-wrap gap-3 my-4">
            {movie.genre_ids.map((genreId) => (
              <span
                key={genreId}
                className="inline-flex items-center gap-x-1.5 py-1 px-2 rounded-full text-xs font-medium bg-red-500 text-white"
              >
                {genreMap[genreId]}
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={() => navigate(`/movies/${movie.id}`)}
            className="rounded-lg border-2 border-red-500 text-red-500 px-8 py-4 font-semibold transition hover:bg-red-500 hover:text-black"
          >
            More Details
          </button>
        </div>
      </div>
    </div>
  );
}
