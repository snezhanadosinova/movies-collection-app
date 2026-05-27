import { Link } from "react-router-dom";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

import toast from "react-hot-toast";

import { logoutUser } from "@/features/auth/services/authService";

import { useAuth } from "@/features/auth/context/AuthContext";

import { getInitials } from "@/utils/getInitials";

function Navbar() {
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser();

      toast.success("Logged out");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <header className="border-b border-zinc-800 bg-zinc-950 h-20">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-5">
        <Link to="/" className="text-2xl font-bold text-red-500">
          Movies
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <Menu as="div" className="relative">
              <MenuButton
                className="
                  flex
                  items-center
                  gap-2
                  rounded-full
                  focus:outline-none
                "
              >
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    bg-red-500
                    font-semibold
                    text-white
                  "
                >
                  {getInitials(user?.displayName || user?.email)}
                </div>
              </MenuButton>

              <MenuItems
                anchor="bottom end"
                className="
                  mt-2
                  w-52
                  rounded-xl
                  border
                  border-zinc-800
                  bg-zinc-900
                  p-2
                  shadow-xl
                  focus:outline-none
                  z-20
                "
              >
                <div className="border-b border-zinc-800 p-3">
                  <p className="font-medium text-white">{user.displayName}</p>

                  <p className="text-sm text-zinc-400">{user.email}</p>
                </div>

                <div className="mt-2 flex flex-col">
                  <MenuItem>
                    <Link
                      to="/profile"
                      className="
                        rounded-lg
                        px-3
                        py-2
                        text-sm
                        transition
                        data-focus:bg-zinc-800
                      "
                    >
                      Profile
                    </Link>
                  </MenuItem>

                  <MenuItem>
                    <Link
                      to="/favorites"
                      className="
                        rounded-lg
                        px-3
                        py-2
                        text-sm
                        transition
                        data-focus:bg-zinc-800
                      "
                    >
                      Favorites
                    </Link>
                  </MenuItem>

                  <MenuItem>
                    <button
                      onClick={handleLogout}
                      className="
                        rounded-lg
                        px-3
                        py-2
                        text-left
                        text-sm
                        text-red-400
                        transition
                        data-focus:bg-zinc-800
                      "
                    >
                      Logout
                    </button>
                  </MenuItem>
                </div>
              </MenuItems>
            </Menu>
          ) : (
            <>
              <Link to="/login" className="hover:text-red-400">
                Login
              </Link>

              <Link
                to="/register"
                className="
                  rounded-md
                  bg-red-500
                  px-4
                  py-2
                  font-medium
                  transition
                  hover:bg-red-600
                "
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
