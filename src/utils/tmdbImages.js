const BASE_URL = "https://image.tmdb.org/t/p";

export const TMDB_IMAGE_SIZES = {
  POSTER_SMALL: "w200",
  POSTER_MEDIUM: "w500",
  BACKDROP: "w1280",
};

export const getTmdbImageUrl = (
  path,
  size = TMDB_IMAGE_SIZES.POSTER_MEDIUM,
) => {
  if (!path) return null;

  return `${BASE_URL}/${size}${path}`;
};

export const getTmdbBackdropUrl = (
  path,
  size = TMDB_IMAGE_SIZES.BACKDROP,
) => {
  return getTmdbImageUrl(path, size);
};

export const getTmdbBackdropSrcSet = (path) => {
  if (!path) return undefined;

  return [
    `${getTmdbBackdropUrl(path, "w780")} 780w`,
    `${getTmdbBackdropUrl(path, "w1280")} 1280w`,
  ].join(", ");
};

export const getTmdbPosterSmallUrl = (path) => {
  return getTmdbImageUrl(path, TMDB_IMAGE_SIZES.POSTER_SMALL);
};