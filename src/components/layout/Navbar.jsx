import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import toast from "react-hot-toast";

import { logoutUser } from "@/features/auth/services/authService";
import { useAuth } from "@/features/auth/context/useAuth";
import { getInitials } from "@/utils/getInitials";
import { readCachedAvatar } from "@/utils/avatarCache";

function Navbar() {
  const { user, loading } = useAuth();
  const [cachedAvatar] = useState(readCachedAvatar);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const initials = loading
    ? cachedAvatar
    : user
      ? getInitials(user.displayName || user.email)
      : "";

  const showAvatar = loading ? Boolean(cachedAvatar) : Boolean(user);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await logoutUser();
      toast.success("Logged out");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="h-20 border-b border-zinc-800 bg-zinc-950">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-full max-w-7xl items-center justify-between px-5"
      >
        <Link to="/" className="text-2xl font-bold text-red-500">
          Movies
        </Link>

        <div className="flex min-h-10 items-center gap-4">
          {showAvatar ? (
            <Menu as="div" className="relative">
              <MenuButton
                disabled={loading}
                aria-label="Open account menu"
                className="flex h-10 w-10 items-center justify-center
                           rounded-full bg-red-500 font-semibold text-white
                           focus-visible:outline-2
                           focus-visible:outline-offset-4
                           focus-visible:outline-red-400"
              >
                <span aria-hidden="true">{initials}</span>
              </MenuButton>

              {!loading && user && (
                <MenuItems
                  anchor="bottom end"
                  className="z-20 mt-2 w-52 rounded-xl border
                             border-zinc-800 bg-zinc-900 p-2
                             text-white shadow-xl focus:outline-none"
                >
                  <div className="border-b border-zinc-800 p-3">
                    <p className="truncate font-medium">
                      {user.displayName || "Account"}
                    </p>

                    <p className="truncate text-sm text-zinc-400">
                      {user.email}
                    </p>
                  </div>

                  <div className="mt-2 flex flex-col">
                    <MenuItem>
                      <Link
                        to="/profile"
                        className="rounded-lg px-3 py-2 text-sm
                                   transition data-focus:bg-zinc-800"
                      >
                        Profile
                      </Link>
                    </MenuItem>

                    <MenuItem>
                      <Link
                        to="/favorites"
                        className="rounded-lg px-3 py-2 text-sm
                                   transition data-focus:bg-zinc-800"
                      >
                        Favorites
                      </Link>
                    </MenuItem>

                    <MenuItem disabled={isLoggingOut}>
                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="rounded-lg px-3 py-2 text-left text-sm
                                   text-red-400 transition
                                   data-focus:bg-zinc-800
                                   disabled:opacity-50"
                      >
                        {isLoggingOut ? "Logging out..." : "Logout"}
                      </button>
                    </MenuItem>
                  </div>
                </MenuItems>
              )}
            </Menu>
          ) : loading ? (
            <div className="h-10 w-10" aria-hidden="true" />
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-red-400">
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-md bg-red-500 px-4 py-2
                           font-medium text-white transition hover:bg-red-600"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
