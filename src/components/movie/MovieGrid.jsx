import MovieCard from "./MovieCard";

function MovieGrid({ movies }) {
  return (
    <div
      className="
        grid
        grid-cols-1
        gap-6
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
      "
    >
      {movies.map((movie, index) => (
        <MovieCard key={movie.id} movie={movie} eager={index < 4} priority={index === 0} />
      ))}
    </div>
  );
}

export default MovieGrid;
