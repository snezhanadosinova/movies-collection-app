export function selectTrailer(videos = []) {
  const trailers = videos.filter(
    (video) =>
      video.site === "YouTube" &&
      video.type === "Trailer" &&
      typeof video.key === "string" &&
      /^[A-Za-z0-9_-]{11}$/.test(video.key),
  );

  return trailers.find((video) => video.official) ?? trailers[0] ?? null;
}

export function selectRelatedMovies(movie, limit = 6) {
  const cleanResults = (results = []) => {
    const seen = new Set([movie.id]);

    return results.filter((item) => {
      if (!item?.id || seen.has(item.id) || item.adult) {
        return false;
      }

      seen.add(item.id);
      return true;
    });
  };

  const recommendations = cleanResults(
    movie.recommendations?.results,
  );

  const results = recommendations.length
    ? recommendations
    : cleanResults(movie.similar?.results);

  return results.slice(0, limit);
}