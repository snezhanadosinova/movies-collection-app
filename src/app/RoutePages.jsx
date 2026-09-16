import MovieDetailsSkeleton from "@/features/movies/components/MovieDetailsSkeleton";
import PersonDetailsSkeleton from "@/features/people/components/PersonDetailsSkeleton";
import ProfileSkeleton from "@/features/profile/components/ProfileSkeleton";
import FavoritesSkeleton from "@/features/favorites/pages/FavoritesSkeleton";
import FeaturedSkeleton from "@/components/movie/FeaturedSkeleton";
import CatalogSkeleton from "@/components/movie/CatalogSkeleton";
import TvSeasonSkeleton from "@/features/tv/components/TvSeasonSkeleton";
import TvDetailsSkeleton from "@/features/tv/components/TvDetailsSkeleton";
import { lazy, Suspense } from "react";

import PageLoader from "@/components/common/PageLoader";

const LazyRegisterPage = lazy(
  () => import("@/features/auth/pages/RegisterPage"),
);

const LazyLoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));

const LazyMovieDetailsPage = lazy(
  () => import("@/features/movies/pages/MovieDetailsPage"),
);

const LazyProfilePage = lazy(
  () => import("@/features/profile/pages/ProfilePage"),
);

const LazyFavoritesPage = lazy(
  () => import("@/features/favorites/pages/FavoritesPage"),
);

const LazyPersonDetailsPage = lazy(
  () => import("@/features/people/pages/PersonDetailsPage"),
);

function PageBoundary({ children, fallback = <PageLoader /> }) {
  return <Suspense fallback={fallback}>{children}</Suspense>;
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
    <PageBoundary fallback={<MovieDetailsSkeleton />}>
      <LazyMovieDetailsPage />
    </PageBoundary>
  );
}

export function ProfileRoute() {
  return (
    <PageBoundary fallback={<ProfileSkeleton />}>
      <LazyProfilePage />
    </PageBoundary>
  );
}

export function FavoritesRoute() {
  return (
    <PageBoundary fallback={<FavoritesSkeleton />}>
      <LazyFavoritesPage />
    </PageBoundary>
  );
}

export function PersonDetailsRoute() {
  return (
    <PageBoundary fallback={<PersonDetailsSkeleton />}>
      <LazyPersonDetailsPage />
    </PageBoundary>
  );
}

const LazyTvCatalogPage = lazy(() => import("@/features/tv/pages/TvCatalogPage"));

export function TvCatalogRoute() {
  return (
    <PageBoundary fallback={<CatalogSkeleton label="Loading TV series" />}>
      <LazyTvCatalogPage />
    </PageBoundary>
  );
}
const LazyTvDetailsPage = lazy(() => import("@/features/tv/pages/TvDetailsPage"));

export function TvDetailsRoute() {
  return (
    <Suspense fallback={<TvDetailsSkeleton />}>
      <LazyTvDetailsPage />
    </Suspense>
  );
}
const LazyTvSeasonPage = lazy(() => import("@/features/tv/pages/TvSeasonPage"));

export function TvSeasonRoute() {
  return (
    <Suspense fallback={<TvSeasonSkeleton />}>
      <LazyTvSeasonPage />
    </Suspense>
  );
}
const LazyMovieCatalogPage = lazy(() => import("@/features/movies/pages/MovieCatalogPage"));

export function MovieCatalogRoute() {
  return <PageBoundary fallback={<CatalogSkeleton />}><LazyMovieCatalogPage /></PageBoundary>;
}

const LazyHomePage = lazy(() => import("@/features/movies/pages/HomePage"));
export function HomeRoute() {
  return <PageBoundary fallback={<FeaturedSkeleton />}><LazyHomePage /></PageBoundary>;
}
