import { useParams } from "react-router-dom";
import { useMovieDetails } from "../hooks/useMovieDetails";
import { Link } from "react-router-dom";

function MovieDetailsPage() {
  const { id } = useParams();

  const { data: movie, isLoading, isError } = useMovieDetails(id);

  if (isLoading) {
    return <div className="p-10">Loading movie...</div>;
  }

  if (isError || !movie) {
    return <div className="p-10 text-red-500">Failed to load movie.</div>;
  }

  const cast = movie?.credits?.cast || [];
  const videos = movie?.videos?.results || [];
  const similar = movie?.similar?.results || [];

  const trailer = videos.find((v) => v.type === "Trailer");

  return (
    <div className="min-h-screen text-white">
      {/* HERO */}
      <div
        className="relative h-[500px] bg-cover bg-center"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative mx-auto flex h-full max-w-7xl items-end gap-10 p-10">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="hidden w-[300px] rounded-xl md:block"
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

      {/* TRAILER */}
      {trailer && (
        <div className="mx-auto max-w-7xl p-10">
          <h2 className="mb-4 text-2xl font-bold">Trailer</h2>

          <iframe
            className="h-[500px] w-full"
            src={`https://www.youtube.com/embed/${trailer.key}`}
            allowFullScreen
          />
        </div>
      )}

      {/* CAST */}
      <div className="mx-auto max-w-7xl p-10">
        <h2 className="mb-4 text-2xl font-bold">Cast</h2>

        <div className="flex gap-4 overflow-x-auto">
          {cast.slice(0, 10).map((actor) => (
            <div key={actor.id} className="min-w-[120px]">
              <img
                className="h-[150px] w-full rounded object-cover"
                src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
              />
              <p className="text-sm">{actor.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SIMILAR */}

      <div className="mx-auto max-w-7xl p-10">
        <h2 className="mb-4 text-2xl font-bold">Similar Movies</h2>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {similar.slice(0, 5).map((m) => (
            <Link key={m.id} to={`/movies/${m.id}`} className="group">
              <div className="overflow-hidden rounded-lg transition group-hover:scale-105">
                <img
                  src={`https://image.tmdb.org/t/p/w300${m.poster_path}`}
                  alt={m.title}
                  className="h-[300px] w-full object-cover"
                />

                <div className="p-2">
                  <p className="line-clamp-1 text-sm font-semibold">
                    {m.title}
                  </p>

                  <p className="text-xs text-zinc-400">
                    ⭐ {m.vote_average?.toFixed(1)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MovieDetailsPage;
