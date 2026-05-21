import {
  doc,
  getDoc,
  setDoc,
  deleteField,
} from "firebase/firestore";

import { db } from "../../../lib/firebase";

const getFavoritesRef = (uid) => {
  return doc(db, "users", uid);
};

export const getUserFavorites = async (uid) => {
  const docRef = getFavoritesRef(uid);

  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return {};
  }

  const data = snapshot.data();

  return data.favorites || {};
};

export const addFavorite = async (uid, movieId) => {
  const docRef = getFavoritesRef(uid);

  await setDoc(
    docRef,
    {
      favorites: {
        [movieId]: true,
      },
    },
    { merge: true },
  );
};

export const removeFavorite = async (uid, movieId) => {
  const docRef = getFavoritesRef(uid);

  await setDoc(
    docRef,
    {
      favorites: {
        [movieId]: deleteField(),
      },
    },
    { merge: true },
  );
};
