import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

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

  const fullName = `${firstName} ${lastName}`;

  await updateProfile(userCredential.user, {
    displayName: fullName,
  });

  // ensure Firebase state is updated
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

// optional future use
export const updateUserProfile = async (data) => {
  if (!auth.currentUser) return;

  await updateProfile(auth.currentUser, {
    displayName: `${data.firstName} ${data.lastName}`,
  });

  await auth.currentUser.reload();

  return auth.currentUser;
};
