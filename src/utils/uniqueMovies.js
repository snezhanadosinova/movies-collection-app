export function uniqueMovies(movies) {
  const seenIds = new Set();

  return movies.filter((movie) => {
    if (seenIds.has(movie.id)) {
      return false;
    }

    seenIds.add(movie.id);
    return true;
  });
}