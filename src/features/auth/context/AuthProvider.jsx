import { useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getInitials } from "@/utils/getInitials";
import { saveCachedAvatar } from "@/utils/avatarCache";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => auth.currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      const initials = currentUser
        ? getInitials(currentUser.displayName || currentUser.email)
        : "";

      saveCachedAvatar(initials);

      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const refreshUser = async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) return;

    await currentUser.reload();

    // Ignore a refresh that completed after logout or an account change.
    if (auth.currentUser !== currentUser) return;

    saveCachedAvatar(getInitials(currentUser.displayName || currentUser.email));

    // Create a new reference so context consumers receive the update.
    setUser({ ...currentUser });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
