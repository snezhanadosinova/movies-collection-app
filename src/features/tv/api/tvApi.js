import api from "@/lib/axios";

export const getTvGenres = async ({ signal } = {}) => {
  const { data } = await api.get("/genre/tv/list", { signal });
  return data.genres;
};

export const getTvPage = async ({ search = "", genre = "", page = 1, signal }) => {
  const endpoint = search ? "/search/tv" : genre ? "/discover/tv" : "/tv/popular";
  const { data } = await api.get(endpoint, {
    signal,
    params: {
      page,
      ...(search ? { query: search } : genre ? { with_genres: genre } : {}),
    },
  });
  return data;
};

export const getTvDetails = async (id, signal) => {
  const { data } = await api.get(`/tv/${id}`, {
    signal,
    params: {
      append_to_response: "aggregate_credits,videos,recommendations",
    },
  });
  return data;
};