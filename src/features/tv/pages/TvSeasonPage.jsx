import { getPersonReturnState } from "@/utils/personReturn";
import { Link, useLocation, useParams } from "react-router-dom";
import { getTmdbImageUrl } from "@/utils/tmdbImages";
import { useTvSeason } from "../hooks/useTvSeason";
import { formatTvDate } from "../utils/tvDetails";
import TvSeasonSkeleton from "../components/TvSeasonSkeleton";
import SeasonEpisodeList from "../components/SeasonEpisodeList";

const focusClass = "rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400";
const retryClass = focusClass + " mt-4 min-h-11 bg-red-500 px-5 py-2 disabled:opacity-50";

export default function TvSeasonPage() {
  const { id, seasonNumber } = useParams();
  const location = useLocation();
  const returnState = getPersonReturnState(location.state);
  const { data: season, isPending, isError, isInvalidParams, error, isFetching, refetch } =
    useTvSeason(id, seasonNumber);

  const validSeriesId = /^[1-9]\d*$/.test(String(id ?? ""));
  const backTo = validSeriesId ? `/tv/${id}` : "/tv";
  const backLabel = validSeriesId ? "Back to series" : "Browse TV series";
  const notFound = isInvalidParams || (!season && error?.response?.status === 404);

  if (!isInvalidParams && isPending) return <TvSeasonSkeleton />;

  if (notFound || !season) {
    return (
      <div className="mx-auto min-h-[60vh] max-w-5xl px-4 py-16 text-white sm:px-6">
        <h1 className="text-3xl font-bold">
          {notFound ? "Season not found" : "Could not load this season"}
        </h1>
        <p role="alert" className="mt-4 text-zinc-400">
          {notFound ? "This season is unavailable or the address is incorrect." : "Please try again."}
        </p>
        {!notFound && (
          <button type="button" className={retryClass} disabled={isFetching}
            onClick={() => refetch({ cancelRefetch: false })}>
            {isFetching ? "Retrying..." : "Retry"}
          </button>
        )}
        <Link to={backTo} state={{ ...returnState, restoreScrollKey: location.state?.fromSeriesKey }} replace className={focusClass + " mt-6 block w-fit py-3 text-red-400"}>
          {backLabel}
        </Link>
      </div>
    );
  }

  const episodes = [...(season.episodes ?? [])].sort(
    (first, second) => first.episode_number - second.episode_number,
  );
  const seasonTitle = season.name ||
    (Number(seasonNumber) === 0 ? "Specials" : `Season ${seasonNumber}`);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 text-white sm:px-6">
      <Link to={backTo} state={{ ...returnState, restoreScrollKey: location.state?.fromSeriesKey }} replace className={focusClass + " mb-8 inline-flex min-h-11 items-center text-zinc-300"}>
        ← {backLabel}
      </Link>

      {isError && (
        <div className="mb-6 rounded-xl border border-amber-800 p-4">
          <p role="alert" className="text-amber-300">
            Could not refresh this season. Showing available episodes.
          </p>
          <button type="button" className={retryClass} disabled={isFetching}
            onClick={() => refetch({ cancelRefetch: false })}>
            {isFetching ? "Retrying..." : "Retry"}
          </button>
        </div>
      )}

      <header className="grid gap-6 sm:grid-cols-[180px_1fr]">
        <div className="mx-auto aspect-[2/3] w-36 overflow-hidden rounded-2xl bg-zinc-900 sm:w-full">
          {season.poster_path ? (
            <img src={getTmdbImageUrl(season.poster_path, "w342")}
              alt="" width="342" height="513" fetchPriority="high"
              className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center p-3 text-sm text-zinc-400">
              Poster unavailable
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-red-400 text-center sm:text-left">TV season</p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl text-center sm:text-left">{seasonTitle}</h1>
          <p className="mt-4 text-zinc-400 text-center sm:text-left">
            {episodes.length} episodes · {formatTvDate(season.air_date)}
          </p>
          <p className="mt-5 whitespace-pre-line leading-7 text-zinc-300">
            {season.overview || "Season overview is unavailable."}
          </p>
        </div>
      </header>

      <section aria-labelledby="season-episodes" className="mt-12">
        <h2 id="season-episodes" className="mb-6 text-2xl font-bold">Episodes</h2>
        {episodes.length === 0 ? (
          <p className="rounded-xl border border-zinc-800 p-6 text-zinc-400">
            No episodes are available for this season yet.
          </p>
        ) : (
          <SeasonEpisodeList key={id + ":" + seasonNumber} episodes={episodes} />
        )}
      </section>
    </div>
  );
}
