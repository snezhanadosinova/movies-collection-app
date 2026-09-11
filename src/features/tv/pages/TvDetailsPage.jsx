import FavoriteButton from "@/components/movie/FavoriteButton";
import { Link, useLocation, useParams } from "react-router-dom";
import RecommendationsSection from "@/components/media/RecommendationsSection";
import { MovieCastSection } from "@/features/movies/components/MovieCastSection";
import { MovieTrailerSection } from "@/features/movies/components/MovieTrailerSection";
import { selectTrailer } from "@/utils/movieDetails";
import {
  getTmdbImageUrl,
  getTmdbBackdropUrl,
  getTmdbBackdropSrcSet,
} from "@/utils/tmdbImages";
import { useTvDetails } from "../hooks/useTvDetails";
import {
  getTvCast,
  getTvRecommendations,
  formatTvDate,
} from "../utils/tvDetails";
import TvDetailsSkeleton from "../components/TvDetailsSkeleton";

const focus =
  "rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400";
const retryClass =
  focus + " mt-3 min-h-11 bg-red-500 px-5 py-2 disabled:opacity-50";

export default function TvDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const fromPerson = location.state?.fromPerson;
  const hasPersonOrigin =
    typeof fromPerson === "string" &&
    /^\/people\/[1-9]\d*(?:[?#].*)?$/.test(fromPerson);
  const backTo = hasPersonOrigin ? fromPerson : "/tv";
  const backLabel = hasPersonOrigin ? "Back to actor" : "TV Series";
  const {
    data: series,
    isPending,
    isError,
    isInvalidId,
    error,
    isFetching,
    refetch,
  } = useTvDetails(id);
  const notFound = isInvalidId || (!series && error?.response?.status === 404);

  if (!isInvalidId && isPending) return <TvDetailsSkeleton />;

  if (notFound || !series) {
    return (
      <div className="mx-auto min-h-[60vh] max-w-7xl px-4 py-16 text-white">
        <h1 className="text-3xl font-bold">
          {notFound ? "Series not found" : "Could not load this series"}
        </h1>
        <p role="alert" className="mt-4 text-zinc-400">
          {notFound
            ? "This series is unavailable or the address is incorrect."
            : "Please try again."}
        </p>
        {!notFound && (
          <button
            type="button"
            className={retryClass}
            disabled={isFetching}
            onClick={() => refetch({ cancelRefetch: false })}
          >
            Retry
          </button>
        )}
        <Link
          to={backTo} replace={hasPersonOrigin}
          className={focus + " mt-6 block w-fit py-3 text-red-400"}
        >
          {hasPersonOrigin ? backLabel : "Browse TV series"}
        </Link>
      </div>
    );
  }

  const trailer = selectTrailer(series.videos?.results ?? []);
  const cast = getTvCast(series.aggregate_credits);
  const recommendations = getTvRecommendations(series);
  const seasons = [...(series.seasons ?? [])].sort(
    (a, b) => a.season_number - b.season_number,
  );
  const facts = [
    ["Status", series.status || "Not available"],
    ["First aired", formatTvDate(series.first_air_date)],
    ["Last aired", formatTvDate(series.last_air_date)],
    ["Seasons", series.number_of_seasons ?? "Not available"],
    ["Episodes", series.number_of_episodes ?? "Not available"],
    [
      "Episode runtime",
      series.episode_run_time?.length
        ? series.episode_run_time.join(" / ") + " min"
        : "Not available",
    ],
    [
      "Networks",
      series.networks?.map((item) => item.name).join(", ") || "Not available",
    ],
    ["Original language", series.original_language || "Not available"],
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative overflow-hidden">
        {series.backdrop_path && (
          <img
            src={getTmdbBackdropUrl(series.backdrop_path)}
            srcSet={getTmdbBackdropSrcSet(series.backdrop_path)}
            sizes="100vw"
            alt=""
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover opacity-50"
          />
        )}
        <div
          className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-black/30"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            to={backTo} replace={hasPersonOrigin}
            className={
              focus + " mb-6 inline-flex min-h-11 items-center text-zinc-300"
            }
          >
            ← {backLabel}
          </Link>
          <div className="grid items-start gap-8 md:grid-cols-[260px_1fr]">
            <div className="mx-auto aspect-[2/3] w-36 overflow-hidden rounded-2xl bg-zinc-800 shadow-xl sm:w-44 lg:mx-0 lg:w-full">
              {series.poster_path ? (
                <img
                  src={getTmdbImageUrl(series.poster_path)}
                  alt={series.name}
                  width="500"
                  height="750"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center p-4 text-zinc-400">
                  Poster unavailable
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium uppercase tracking-widest text-red-400">
                TV Series
              </p>
              <h1 className="mt-3 break-words text-3xl font-bold sm:text-5xl">
                {series.name || "Untitled series"}
              </h1>
              {series.tagline && (
                <p className="mt-3 text-lg italic text-zinc-300">
                  {series.tagline}
                </p>
              )}
              <p className="mt-4 text-zinc-300">
                <span className="rounded-full bg-amber-400/15 px-3 py-1 text-sm font-semibold text-amber-300">
                  ★{" "}
                  {Number.isFinite(series.vote_average)
                    ? series.vote_average.toFixed(1) + " / 10"
                    : "Not rated"}
                </span>
              </p>
              <ul className="mt-4 flex flex-wrap gap-2" aria-label="Genres">
                {(series.genres ?? []).map((genre) => (
                  <li key={genre.id}>
                    <Link
                      to={`/tv?genre=${genre.id}`}
                      className={
                        focus +
                        " rounded-full border border-white/15 px-3 py-1 text-sm text-zinc-200 hover:bg-zinc-800"
                      }
                    >
                      {genre.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-6 whitespace-pre-line leading-7 text-zinc-300">
                {series.overview || "Overview is unavailable."}
              </p>
              <div className="mt-6">
                <FavoriteButton movieId={series.id} movieTitle={series.name} mediaType="tv" />
              </div>
              {series.created_by?.length > 0 && (
                <div className="mt-6">
                  <h2 className="mt-4 text-sm text-zinc-300 font-bold">
                    Created by
                  </h2>
                  <ul className="flex flex-wrap gap-4">
                    {series.created_by.map((person) => (
                      <li key={person.id}>
                        <Link
                          to={`/people/${person.id}`}
                          className={
                            focus +
                            " inline-flex min-h-11 items-center text-red-400"
                          }
                        >
                          {person.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
        {isError && (
          <div>
            <p role="alert" className="text-amber-300">
              Could not refresh this series. Showing available details.
            </p>
            <button
              type="button"
              disabled={isFetching}
              className={retryClass}
              onClick={() => refetch({ cancelRefetch: false })}
            >
              Retry
            </button>
          </div>
        )}

        <section aria-labelledby="series-information">
          <h2 id="series-information" className="mb-5 text-2xl font-bold">
            Series information
          </h2>
          <dl className="grid gap-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map(([label, value]) => (
              <div key={label}>
                <dt className="text-sm text-zinc-400">{label}</dt>
                <dd className="mt-1 font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <MovieCastSection key={`cast-${series.id}`} cast={cast} />
        <MovieTrailerSection
          key={`trailer-${series.id}-${trailer?.key ?? "none"}`}
          trailer={trailer}
          heading="Trailer"
        />

        <section aria-labelledby="series-seasons">
          <h2 id="series-seasons" className="mb-5 text-2xl font-bold">
            Seasons
          </h2>
          {seasons.length === 0 ? (
            <p className="text-zinc-400">Season information is unavailable.</p>
          ) : (
            <ul className="grid gap-4 md:grid-cols-2">
              {seasons.map((season) => (
                <li key={season.season_number}>
                  <Link
                    to={`/tv/${series.id}/seasons/${season.season_number}`}
                    className={
                      focus +
                      " flex h-full gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition-colors hover:border-zinc-600 hover:bg-zinc-800"
                    }
                  >
                    <div className="aspect-[2/3] w-20 shrink-0 self-start overflow-hidden rounded-lg bg-zinc-800">
                      {season.poster_path && (
                        <img
                          src={getTmdbImageUrl(season.poster_path, "w154")}
                          alt=""
                          loading="lazy"
                          width="154"
                          height="231"
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold">
                        {season.name || `Season ${season.season_number}`}
                      </h3>
                      <p className="mt-1 text-sm text-zinc-400">
                        {season.episode_count ?? 0} episodes ·{" "}
                        {formatTvDate(season.air_date)}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-zinc-300">
                        {season.overview || "Overview is unavailable."}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <RecommendationsSection
          key={`recommendations-${series.id}`}
          items={recommendations}
          mediaType="tv"
        />
      </div>
    </div>
  );
}
