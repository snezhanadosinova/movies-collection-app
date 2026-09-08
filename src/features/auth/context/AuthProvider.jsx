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

  // FORCE refresh user (important for displayName updates)
  const refreshUser = async () => {
    if (!auth.currentUser) return;

    await auth.currentUser.reload();

    // spread creates new reference → forces rerender
    setUser({ ...auth.currentUser });
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
