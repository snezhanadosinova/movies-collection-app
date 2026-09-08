export const getUserFavorites = async (uid) => {
  const firestore = await import("./favoritesFirestore");

  return firestore.getUserFavorites(uid);
};

export const addFavorite = async (uid, movieId) => {
  const firestore = await import("./favoritesFirestore");

  return firestore.addFavorite(uid, movieId);
};

export const removeFavorite = async (uid, movieId) => {
  const firestore = await import("./favoritesFirestore");

  return firestore.removeFavorite(uid, movieId);
};
