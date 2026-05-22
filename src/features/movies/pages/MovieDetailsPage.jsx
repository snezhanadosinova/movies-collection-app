import { useParams } from "react-router-dom";
import { useMovieDetails } from "../hooks/useMovieDetails";
import { MovieHeroSection } from "../components/MovieHeroSection";
import { MovieTrailerSection } from "../components/MovieTrailerSection";
import { MovieCastSection } from "../components/MovieCastSection";
import { MovieSimilarSection } from "../components/MovieSimilarSection";

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
      <MovieHeroSection movie={movie} />
      <MovieTrailerSection trailer={trailer} />
      <MovieCastSection cast={cast} />
      <MovieSimilarSection similar={similar} />
    </div>
  );
}

export default MovieDetailsPage;
