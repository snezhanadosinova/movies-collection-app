import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const getFavoriteMovies = async (favoriteIds = {}) => {
  const ids = Object.keys(favoriteIds);

  if (!ids.length) return [];

  const requests = ids.map((id) =>
    axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`),
  );

  const results = await Promise.all(requests);

  return results.map((r) => r.data);
};
