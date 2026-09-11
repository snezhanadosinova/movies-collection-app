import MediaCard from "./MediaCard";
import FavoriteButton from "@/components/movie/FavoriteButton";

export default function FavoriteMediaCard({ item }) {
  const mediaType = item.media_type === "tv" ? "tv" : "movie";
  const title = mediaType === "tv" ? item.name || "Untitled series" : item.title || "Untitled movie";

  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
        {mediaType === "tv" ? "TV Series" : "Movie"}
      </p>
      <MediaCard
        title={title}
        to={`/${mediaType === "tv" ? "tv" : "movies"}/${item.id}`}
        posterPath={item.poster_path}
        voteAverage={item.vote_average}
        action={<FavoriteButton movieId={item.id} movieTitle={title} mediaType={mediaType} compact />}
      />
    </div>
  );
}
