import { createBrowserRouter } from "react-router-dom";

import MainLayout from "@/components/layout/MainLayout";
import HomePage from "@/features/movies/pages/HomePage";
import ProtectedRoute from "@/routes/ProtectedRoute";

import {
  RegisterRoute,
  LoginRoute,
  MovieDetailsRoute,
  ProfileRoute,
  FavoritesRoute,
} from "./RoutePages";

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
        element: <RegisterRoute />,
      },
      {
        path: "login",
        element: <LoginRoute />,
      },
      {
        path: "movies/:id",
        element: <MovieDetailsRoute />,
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <ProfileRoute />
          </ProtectedRoute>
        ),
      },
      {
        path: "favorites",
        element: (
          <ProtectedRoute>
            <FavoritesRoute />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
