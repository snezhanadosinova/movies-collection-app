import Breadcrumbs from "@/components/common/Breadcrumbs";
import MovieDetailsSkeleton from "../components/MovieDetailsSkeleton";
import { getCatalogReturn } from "@/utils/scrollReturn";
import { getPersonReturnState } from "@/utils/personReturn";
import { useLocation, useParams } from "react-router-dom";

import { useMovieDetails } from "../hooks/useMovieDetails";
import { MovieHeroSection } from "../components/MovieHeroSection";
import { MovieTrailerSection } from "../components/MovieTrailerSection";
import { MovieCastSection } from "../components/MovieCastSection";
import { MovieSimilarSection } from "../components/MovieSimilarSection";
import { selectRelatedMovies, selectTrailer } from "@/utils/movieDetails";

function MovieDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const returnState = getPersonReturnState(location.state);
  const backTo = returnState?.fromPerson ?? getCatalogReturn(location.state, "/movies");
  const backLabel = returnState ? "Back to actor" : "Browse movies";


  const {
    data: movie,
    isLoading,
    isError,
    isInvalidId,
    error,
    refetch,
    isFetching,
  } = useMovieDetails(id);

  const backLink = (
    <Breadcrumbs to={backTo} state={{ restoreScrollKey: returnState?.fromPersonKey ?? location.state?.fromCatalogKey }} replace={Boolean(returnState)} label={backLabel} current={movie?.title || "Movie details"} />
  );

  const isNotFound = isInvalidId || error?.response?.status === 404;

  if (isNotFound) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl font-bold">Movie not found</h1>

        <p className="mt-3 text-zinc-400">
          This movie is unavailable or the address is incorrect.
        </p>

        {backLink}
      </div>
    );
  }

  if (isLoading) {
    return <MovieDetailsSkeleton navigation={backLink} />;
  }

  if (!movie) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {backLink}
        <h1 className="text-3xl font-bold">Could not load this movie</h1>

        <p role="alert" className="mt-3 text-zinc-400">
          Please try again.
        </p>

        <button
          type="button"
          onClick={() => refetch({ cancelRefetch: false })}
          disabled={isFetching}
          className="mt-6 rounded-xl bg-red-500 px-5 py-3
                     font-semibold disabled:opacity-50"
        >
          {isFetching ? "Retrying..." : "Retry"}
        </button>
      </div>
    );
  }

  const trailer = selectTrailer(movie.videos?.results);
  const relatedMovies = selectRelatedMovies(movie);
  const cast = movie.credits?.cast ?? [];

  return (
    <div className="min-h-screen bg-black text-white">

      {backLink}
      <MovieHeroSection movie={movie} />

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:space-y-16 lg:px-8">
        {isError && (
          <p role="alert" className="text-amber-300">
            Could not refresh this movie. Showing previously loaded details.
          </p>
        )}

        <MovieCastSection key={`cast-${movie.id}`} cast={cast} />

        <MovieTrailerSection
          key={`trailer-${movie.id}-${trailer?.key ?? "none"}`}
          trailer={trailer}
        />

        <MovieSimilarSection similar={relatedMovies} />
      </div>
    </div>
  );
}

export default MovieDetailsPage;
