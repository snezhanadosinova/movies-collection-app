export function getFavoriteKey(id, mediaType = "movie") {
  if (!["movie", "tv"].includes(mediaType) || !/^[1-9]\d*$/.test(String(id))) {
    throw new Error("Invalid favorite identity.");
  }
  // Keep existing movie keys compatible with already saved documents.
  return mediaType === "tv" ? `tv:${id}` : String(id);
}

export function parseFavoriteKey(key) {
  const match = /^(?:(tv):)?([1-9]\d*)$/.exec(key);
  return match ? { id: match[2], mediaType: match[1] || "movie", key } : null;
}

export function getFavoriteEntries(favorites = {}) {
  return Object.entries(favorites)
    .filter(([, value]) => value === true)
    .map(([key]) => parseFavoriteKey(key))
    .filter(Boolean);
}
