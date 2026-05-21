import { useQuery } from "@tanstack/react-query";
import { getUserFavorites } from "../services/favoritesService";
import { useAuth } from "../../auth/context/AuthContext";

export const useFavorites = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["favorites", user?.uid],
    queryFn: () => getUserFavorites(user.uid),
    enabled: !!user,
  });
};
