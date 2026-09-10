import MediaCard from "@/components/media/MediaCard";
import FavoriteButton from "./FavoriteButton";

function MovieCard({ movie }) {
  if (!movie?.id) return null;

  const title = movie.title || "Untitled movie";

  return (
    <MediaCard
      title={title}
      to={`/movies/${movie.id}`}
      posterPath={movie.poster_path}
      voteAverage={movie.vote_average}
      action={
        <FavoriteButton movieId={movie.id} movieTitle={title} compact />
      }
    />
  );
}

export default MovieCard;
