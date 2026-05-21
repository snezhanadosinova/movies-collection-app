import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useFavoriteMovies } from "@/features/favorites/hooks/useFavoriteMovies";
import { updateUserProfile } from "@/features/auth/services/authService";

function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const { data: favoriteMovies = [] } = useFavoriteMovies();

  const [firstName, setFirstName] = useState(
    user?.displayName?.split(" ")[0] || "",
  );

  const [lastName, setLastName] = useState(
    user?.displayName?.split(" ")[1] || "",
  );

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const handleSave = async () => {
    try {
      setLoading(true);

      await updateUserProfile({
        firstName,
        lastName,
      });

      await refreshUser();

      setEditMode(false);

      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-6 text-white">
      <h1 className="mb-6 text-3xl font-bold">Profile</h1>

      {/* ACCOUNT CARD */}
      <div className="rounded-xl bg-zinc-900 p-6">
        <div className="text-xl font-bold">{user?.displayName}</div>
        <p className="text-zinc-400">{user?.email}</p>
      </div>

      {/*Favorites */}
      <div className="mt-8 rounded-xl bg-zinc-900 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            Favorites ({favoriteMovies.length})
          </h2>

          <Link
            to="/favorites"
            className="text-sm text-red-400 hover:text-red-300"
          >
            View all →
          </Link>
        </div>

        {favoriteMovies.length === 0 ? (
          <p className="text-zinc-400">No favorites yet 💔</p>
        ) : (
          <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
            {favoriteMovies.slice(0, 6).map((movie) => (
              <Link key={movie.id} to={`/movies/${movie.id}`}>
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  className="rounded transition hover:scale-105"
                />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* SETTINGS */}
      <div className="mt-8 rounded-xl bg-zinc-900 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Settings</h2>

          <button
            onClick={() => setEditMode(!editMode)}
            className="text-sm text-red-400"
          >
            {editMode ? "Cancel" : "Edit"}
          </button>
        </div>

        {editMode ? (
          <div className="space-y-4">
            <input
              className="w-full rounded bg-zinc-800 p-3"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
            />

            <input
              className="w-full rounded bg-zinc-800 p-3"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
            />

            <button
              onClick={handleSave}
              disabled={loading}
              className="rounded bg-red-500 px-4 py-2 font-semibold"
            >
              {loading ? "Saving..." : "Save changes"}
            </button>
          </div>
        ) : (
          <p className="text-zinc-400">
            You can only change your display name.
          </p>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
