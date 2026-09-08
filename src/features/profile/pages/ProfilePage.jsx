import { useAuth } from "@/features/auth/context/useAuth";
import { useFavoriteMovies } from "@/features/favorites/hooks/useFavoriteMovies";

import { ProfileInfoCard } from "../components/ProfileInfoCard";
import { ProfileFavoritesPreview } from "../components/ProfileFavoritesPreview";

function ProfilePage() {
  const { user, loading, refreshUser } = useAuth();

  const {
    data: favoriteMovies = [],
    isLoading: favoritesLoading,
    isError: favoritesError,
  } = useFavoriteMovies();

  const isProfileReady = !loading && Boolean(user);
  const isPreviewLoading = !isProfileReady || favoritesLoading;

  return (
    <div className="mx-auto max-w-5xl p-6 text-white">
      <h1 className="mb-6 text-3xl font-bold">Profile</h1>

      <ProfileInfoCard
        key={user?.uid || "pending"}
        user={isProfileReady ? user : null}
        loading={!isProfileReady}
        onProfileUpdate={refreshUser}
      />

      {isPreviewLoading ? (
        <section
          className="mt-8 rounded-xl bg-zinc-900 p-6"
          role="status"
          aria-label="Loading favorites"
        >
          <span className="sr-only">Loading favorites...</span>

          <div aria-hidden="true">
            <div className="mb-4 flex h-7 items-center">
              <div className="h-5 w-36 rounded bg-zinc-800" />
            </div>

            <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
              {Array.from({ length: 6 }, (_, index) => (
                <div
                  key={index}
                  className="aspect-[2/3] animate-pulse rounded
                             bg-zinc-800 motion-reduce:animate-none"
                />
              ))}
            </div>
          </div>
        </section>
      ) : favoritesError ? (
        <div className="mt-8 rounded-xl bg-zinc-900 p-6">
          <p role="alert" className="text-red-400">
            Could not load favorites.
          </p>
        </div>
      ) : (
        <ProfileFavoritesPreview favoriteMovies={favoriteMovies} />
      )}
    </div>
  );
}

export default ProfilePage;