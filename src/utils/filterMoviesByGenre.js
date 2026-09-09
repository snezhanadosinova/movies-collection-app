export function filterMoviesByGenre(movies, selectedGenre) {
  if (!selectedGenre) return movies;

  const genreId = Number(selectedGenre);

  return movies.filter(
    (movie) => movie.genre_ids?.includes(genreId),
  );
}