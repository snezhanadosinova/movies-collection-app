import { lazy, Suspense } from "react";

import PageLoader from "@/components/common/PageLoader";

const LazyRegisterPage = lazy(
  () => import("@/features/auth/pages/RegisterPage"),
);

const LazyLoginPage = lazy(
  () => import("@/features/auth/pages/LoginPage"),
);

const LazyMovieDetailsPage = lazy(
  () => import("@/features/movies/pages/MovieDetailsPage"),
);

const LazyProfilePage = lazy(
  () => import("@/features/profile/pages/ProfilePage"),
);

const LazyFavoritesPage = lazy(
  () => import("@/features/favorites/pages/FavoritesPage"),
);

function PageBoundary({ children }) {
  return (
    <Suspense fallback={<PageLoader />}>
      {children}
    </Suspense>
  );
}

export function RegisterRoute() {
  return (
    <PageBoundary>
      <LazyRegisterPage />
    </PageBoundary>
  );
}

export function LoginRoute() {
  return (
    <PageBoundary>
      <LazyLoginPage />
    </PageBoundary>
  );
}

export function MovieDetailsRoute() {
  return (
    <PageBoundary>
      <LazyMovieDetailsPage />
    </PageBoundary>
  );
}

export function ProfileRoute() {
  return (
    <PageBoundary>
      <LazyProfilePage />
    </PageBoundary>
  );
}

export function FavoritesRoute() {
  return (
    <PageBoundary>
      <LazyFavoritesPage />
    </PageBoundary>
  );
}