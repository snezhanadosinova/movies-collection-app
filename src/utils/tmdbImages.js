/**
 * TMDB Image URL utility functions
 */

const BASE_URL = "https://image.tmdb.org/t/p";

export const TMDB_IMAGE_SIZES = {
  POSTER_SMALL: "w200",
  POSTER_MEDIUM: "w500",
  BACKDROP: "original",
};

/**
 * Get TMDB poster image URL
 * @param {string} path - The poster path from TMDB API
 * @param {string} size - The image size (default: w500)
 * @returns {string} Full image URL
 */
export const getTmdbImageUrl = (
  path,
  size = TMDB_IMAGE_SIZES.POSTER_MEDIUM,
) => {
  if (!path) return null;
  return `${BASE_URL}/${size}${path}`;
};

/**
 * Get TMDB backdrop image URL
 * @param {string} path - The backdrop path from TMDB API
 * @returns {string} Full backdrop URL
 */
export const getTmdbBackdropUrl = (path) => {
  if (!path) return null;
  return getTmdbImageUrl(path, TMDB_IMAGE_SIZES.BACKDROP);
};

/**
 * Get TMDB poster image URL with small size
 * @param {string} path - The poster path from TMDB API
 * @returns {string} Full poster URL
 */
export const getTmdbPosterSmallUrl = (path) => {
  if (!path) return null;
  return getTmdbImageUrl(path, TMDB_IMAGE_SIZES.POSTER_SMALL);
};
