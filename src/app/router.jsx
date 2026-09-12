import { createBrowserRouter } from "react-router-dom";

import MainLayout from "@/components/layout/MainLayout";
import HomePage from "@/features/movies/pages/HomePage";
import ProtectedRoute from "@/routes/ProtectedRoute";

import {
  MovieCatalogRoute,
  TvCatalogRoute,
  TvDetailsRoute,
  TvSeasonRoute,
  RegisterRoute,
  LoginRoute,
  MovieDetailsRoute,
  ProfileRoute,
  FavoritesRoute,
  PersonDetailsRoute
} from "./RoutePages";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,

    children: [
      { path: "movies", element: <MovieCatalogRoute /> },
      { path: "tv/:id/seasons/:seasonNumber", element: <TvSeasonRoute /> },
      { path: "tv/:id", element: <TvDetailsRoute /> },
      { path: "tv", element: <TvCatalogRoute /> },
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
      {
        path: "people/:id",
        element: <PersonDetailsRoute />,
      },
    ],
  },
]);
