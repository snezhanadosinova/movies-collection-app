import { useMovieGenres } from "@/features/movies/hooks/useMovieGenres";

function GenreFilter({ value, onChange }) {
  const { data: genres = [] } = useMovieGenres();

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        rounded-lg
        border
        border-zinc-700
        bg-zinc-900
        px-4
        py-3
        text-white
        outline-none
      "
    >
      <option value="">All Genres</option>

      {genres.map((genre) => (
        <option key={genre.id} value={genre.id}>
          {genre.name}
        </option>
      ))}
    </select>
  );
}

export default GenreFilter;
