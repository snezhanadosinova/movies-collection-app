import api from "@/lib/axios";
import { getFavoriteEntries } from "../utils/favoriteIdentity";

export async function getFavoriteMediaItem(entry, signal) {
  try {
    const { data } = await api.get(`/${entry.mediaType}/${entry.id}`, { signal });
    return { ...data, media_type: entry.mediaType };
  } catch (error) {
    if (error?.response?.status === 404) {
      return {
        id: Number(entry.id),
        media_type: entry.mediaType,
        title: "Unavailable title",
        name: "Unavailable title",
        unavailable: true,
      };
    }
    throw error;
  }
}

// Retained for callers using the original batch API.
export async function getFavoriteMovies(favorites = {}, signal) {
  const entries = getFavoriteEntries(favorites);
  const results = [];
  for (let index = 0; index < entries.length; index += 5) {
    const batch = await Promise.all(
      entries.slice(index, index + 5).map((entry) => getFavoriteMediaItem(entry, signal)),
    );
    results.push(...batch);
  }
  return results;
}
