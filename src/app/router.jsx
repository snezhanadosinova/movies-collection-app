import { createBrowserRouter } from "react-router-dom";

import MainLayout from "@/components/layout/MainLayout";
import HomePage from "@/features/movies/pages/HomePage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import MovieDetailsPage from "@/features/movies/pages/MovieDetailsPage";
import ProfilePage from "../features/profile/pages/ProfilePage";
import FavoritesPage from "../features/favorites/pages/FavoritesPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,

    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "movies/:id",
        element: <MovieDetailsPage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/favorites",
        element: <FavoritesPage />,
      },
    ],
  },
]);
