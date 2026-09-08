import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

import { auth } from "@/lib/firebase";
import { normalizeDisplayName, validateDisplayName } from "@/utils/displayName";

export const registerUser = async ({
  email,
  password,
  firstName,
  lastName,
}) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  await updateProfile(userCredential.user, {
    displayName: `${firstName} ${lastName}`,
  });

  await userCredential.user.reload();

  return auth.currentUser;
};

export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );

  return userCredential.user;
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const updateUserProfile = async ({ displayName }) => {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("Please log in before updating your profile.");
  }

  const validationResult = validateDisplayName(displayName);

  if (validationResult !== true) {
    throw new Error(validationResult);
  }

  await updateProfile(currentUser, {
    displayName: normalizeDisplayName(displayName),
  });

  return currentUser;
};
