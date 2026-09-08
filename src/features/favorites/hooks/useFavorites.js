import { useQuery } from "@tanstack/react-query";
import { getUserFavorites } from "../services/favoritesService";
import { useAuth } from "@/features/auth/context/useAuth";

export const useFavorites = () => {
  const { user, loading } = useAuth();

  return useQuery({
    queryKey: ["favorites", user?.uid],
    queryFn: () => getUserFavorites(user.uid),
    enabled: !loading && !!user,
  });
};
