import {
  doc,
  getDoc,
  setDoc,
  deleteField,
} from "firebase/firestore";

import { db } from "@/lib/firestore";

const getFavoritesRef = (uid) => {
  return doc(db, "users", uid);
};

export const getUserFavorites = async (uid) => {
  const snapshot = await getDoc(getFavoritesRef(uid));

  if (!snapshot.exists()) {
    return {};
  }

  return snapshot.data().favorites || {};
};

export const addFavorite = async (uid, movieId) => {
  await setDoc(
    getFavoritesRef(uid),
    {
      favorites: {
        [movieId]: true,
      },
    },
    { merge: true },
  );
};

export const removeFavorite = async (uid, movieId) => {
  await setDoc(
    getFavoritesRef(uid),
    {
      favorites: {
        [movieId]: deleteField(),
      },
    },
    { merge: true },
  );
};