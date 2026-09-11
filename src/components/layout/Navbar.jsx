import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
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
    <header className="min-h-20 border-b border-zinc-800 bg-zinc-950">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex min-h-20 max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3"
      >
        <div className="flex items-center gap-4">
        <NavLink to="/" className={({ isActive }) =>
            "inline-flex min-h-11 items-center rounded text-xl focus-visible:outline-2 focus-visible:outline-red-400 hover:underline " +
            (isActive ? "text-red-400 font-bold" : "text-white hover:text-red-400")
          }>
            Movies
          </NavLink>

          <NavLink to="/tv" className={({ isActive }) =>
            "inline-flex min-h-11 items-center rounded text-xl focus-visible:outline-2 focus-visible:outline-red-400 hover:underline " +
            (isActive ? "text-red-400 font-bold" : "text-white hover:text-red-400")
          }>
            TV Series
          </NavLink>
        </div>

        <div className="flex min-h-10 items-center gap-3">
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
