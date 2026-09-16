import ProfileSkeleton from "../components/ProfileSkeleton";
import { useAuth } from "@/features/auth/context/useAuth";
import { useFavoriteMovies } from "@/features/favorites/hooks/useFavoriteMovies";

import { ProfileInfoCard } from "../components/ProfileInfoCard";
import { ProfileFavoritesPreview } from "../components/ProfileFavoritesPreview";

function ProfilePage() {
  const { user, loading, refreshUser } = useAuth();

  const {
    data: favoriteMovies = [],
    slots,
    isFetching,
    refetch,
    isLoading: favoritesLoading,
    isError: favoritesError,
  } = useFavoriteMovies();

  const isProfileReady = !loading && Boolean(user);
  const isPreviewLoading = !isProfileReady || favoritesLoading;

  if (!isProfileReady) return <ProfileSkeleton />;

  return (
    <div className="mx-auto max-w-5xl p-6 text-white">
      <h1 className="mb-6 text-3xl font-bold">Profile</h1>

      <ProfileInfoCard
        key={user?.uid || "pending"}
        user={isProfileReady ? user : null}
        loading={!isProfileReady}
        onProfileUpdate={refreshUser}
      />

      <ProfileFavoritesPreview
        favoriteMovies={isProfileReady ? favoriteMovies : []}
        slots={isProfileReady ? slots : []}
        loading={isPreviewLoading}
        isError={isProfileReady && favoritesError}
        isFetching={isFetching}
        onRetry={refetch}
      />
    </div>
  );
}

export default ProfilePage;
