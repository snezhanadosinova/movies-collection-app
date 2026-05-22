import { useAuth } from "@/features/auth/context/AuthContext";
import { useFavoriteMovies } from "@/features/favorites/hooks/useFavoriteMovies";
import { ProfileInfoCard } from "../components/ProfileInfoCard";
import { ProfileFavoritesPreview } from "../components/ProfileFavoritesPreview";
import { ProfileSettingsCard } from "../components/ProfileSettingsCard";

function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const { data: favoriteMovies = [] } = useFavoriteMovies();

  return (
    <div className="mx-auto max-w-5xl p-6 text-white">
      <h1 className="mb-6 text-3xl font-bold">Profile</h1>

      <ProfileInfoCard user={user} />
      <ProfileFavoritesPreview favoriteMovies={favoriteMovies} />
      <ProfileSettingsCard user={user} onProfileUpdate={refreshUser} />
    </div>
  );
}

export default ProfilePage;
