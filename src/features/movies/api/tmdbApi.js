import api from "@/lib/axios";

export const getPopularMovies = async (page = 1) => {
  const { data } = await api.get("/movie/popular", {
    params: {
      page,
    },
  });

  return data;
};

export const getTrendingMovies = async () => {
  const { data } = await api.get("/trending/movie/day");

  return data.results;
};

export const getMovieDetails = async (id, signal) => {
  const { data } = await api.get(`/movie/${id}`, {
    params: {
      append_to_response: "credits,videos,recommendations,similar",
    },
    signal,
  });

  return data;
};

export const searchMovies = async (query, signal, page = 1) => {
  const { data } = await api.get("/search/movie", {
    params: {
      query,
      page,
    },
    signal,
  });

  return data;
};

export const getMovieGenres = async () => {
  const { data } = await api.get("/genre/movie/list");

  return data.genres;
};

export const discoverMovies = async ({ genre, page = 1 }) => {
  const { data } = await api.get("/discover/movie", {
    params: {
      with_genres: genre || undefined,
      page,
    },
  });

  return data;
};
