import { getMediaReturnPath } from "@/utils/mediaReturn";
import { Link, useLocation, useParams } from "react-router-dom";

import { getTmdbImageUrl } from "@/utils/tmdbImages";
import { usePersonDetails } from "../hooks/usePersonDetails";
import { PersonFilmography } from "../components/PersonFilmography";
import {
  formatPersonDate,
  getPersonLinks,
} from "../utils/personDetails";

import { PersonGallery } from "../components/PersonGallery";
import { PersonBiography } from "../components/PersonBiography";

const focusClassName =
  "rounded focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-red-400";

export function PersonDetailsSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading person"
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
    >
      <span className="sr-only">Loading person...</span>

      <div
        aria-hidden="true"
        className="grid gap-8 motion-safe:animate-pulse md:grid-cols-[260px_1fr]"
      >
        <div className="mx-auto aspect-[2/3] w-48 rounded-2xl bg-zinc-800 md:w-full" />

        <div className="space-y-6">
          <div className="h-12 w-3/4 rounded bg-zinc-800" />
          <div className="h-6 w-1/3 rounded bg-zinc-800" />
          <div className="h-40 rounded-2xl bg-zinc-800" />
          <div className="h-40 rounded-2xl bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}

function PersonProfile({ person }) {
  const links = getPersonLinks(person);

  const facts = [
    ["Known for", person.known_for_department || "Not available"],
    ["Born", formatPersonDate(person.birthday)],
    ["Place of birth", person.place_of_birth || "Not available"],
    [
      "Gender",
      {
        1: "Female",
        2: "Male",
        3: "Non-binary",
      }[person.gender] || "Not specified",
    ],
  ];

  if (person.deathday) {
    facts.push(["Died", formatPersonDate(person.deathday)]);
  }

  return (
    <>
      <div className="grid items-start gap-8 md:grid-cols-[260px_1fr] lg:gap-12">
        <aside>
          <div className="mx-auto aspect-[2/3] w-48 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 md:w-full">
            {person.profile_path ? (
              <img
                src={getTmdbImageUrl(person.profile_path, "h632")}
                alt={person.name}
                width="421"
                height="632"
                fetchPriority="high"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center p-6 text-center text-zinc-400">
                Photo unavailable
              </div>
            )}
          </div>

          {links.length > 0 && (
            <nav aria-label="External profiles" className="mt-6">
              <ul className="flex flex-wrap justify-center gap-2 md:justify-start">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${link.label} (opens in a new tab)`}
                      className={`${focusClassName} inline-flex min-h-11 items-center border border-zinc-700 px-3 text-sm hover:bg-zinc-800`}
                    >
                      {link.label} <span aria-hidden="true"> ↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </aside>

        <div className="min-w-0">
          <p className="text-sm font-medium uppercase tracking-widest text-red-400">
            {person.known_for_department || "Person"}
          </p>

          <h1 className="mt-3 break-words text-3xl font-bold tracking-tight sm:text-5xl">
            {person.name}
          </h1>

          <dl className="mt-8 grid grid-cols-1 gap-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:grid-cols-2">
            {facts.map(([label, value]) => (
              <div key={label}>
                <dt className="text-sm text-zinc-400">{label}</dt>
                <dd className="mt-1 font-medium">{value}</dd>
              </div>
            ))}
          </dl>

          <PersonBiography biography={person.biography} />

          {person.also_known_as?.length > 0 && (
            <section aria-labelledby="aliases-heading" className="mt-8">
              <h2 id="aliases-heading" className="text-lg font-semibold">
                Also known as
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {[...new Set(person.also_known_as)].map((name) => (
                  <li
                    key={name}
                    className="rounded-full bg-zinc-800 px-3 py-1 text-sm text-zinc-300"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>

      <PersonGallery
        photos={person.images?.profiles}
        name={person.name}
      />

      <div className="mt-12">
        <PersonFilmography credits={person.combined_credits} />
      </div>

      <p className="mt-10 text-sm text-zinc-500">
        Profile information and credits provided by TMDB.
      </p>
    </>
  );
}

export default function PersonDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const fromMedia = getMediaReturnPath(location.state);
  const backTo = fromMedia ?? "/movies";
  const backLabel = fromMedia
    ? fromMedia.startsWith("/movies/") ? "Back to movie" : "Back to series"
    : "Browse movies";

  const {
    data: person,
    isLoading,
    isError,
    isInvalidId,
    error,
    isFetching,
    refetch,
  } = usePersonDetails(id);

  if (isLoading && !isInvalidId) {
    return <PersonDetailsSkeleton />;
  }

  const isNotFound = isInvalidId || error?.response?.status === 404;

  if (isNotFound || !person) {
    return (
      <div className="mx-auto min-h-[60vh] max-w-7xl px-4 py-16 text-white">
        <h1 className="text-3xl font-bold">
          {isNotFound ? "Person not found" : "Could not load this person"}
        </h1>

        <p role="alert" className="mt-4 text-zinc-400">
          {isNotFound
            ? "This profile is unavailable or the address is incorrect."
            : "Please try again."}
        </p>

        {!isNotFound && (
          <button
            type="button"
            onClick={() => refetch({ cancelRefetch: false })}
            disabled={isFetching}
            className={`${focusClassName} mt-6 min-h-11 bg-red-500 px-5 py-3 disabled:opacity-50`}
          >
            {isFetching ? "Retrying..." : "Retry"}
          </button>
        )}

        <Link
          to={backTo} state={{ restoreScrollKey: fromMedia ? location.state?.fromMediaKey : undefined }} replace={Boolean(fromMedia)}
          className={`${focusClassName} mt-6 block w-fit py-3 text-red-400`}
        >
          <span aria-hidden="true" className="mr-1">←</span>{backLabel}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 text-white sm:px-6 lg:px-8">
      <Link
        to={backTo} state={{ restoreScrollKey: fromMedia ? location.state?.fromMediaKey : undefined }} replace={Boolean(fromMedia)}
        className={`${focusClassName} mb-8 inline-flex min-h-11 items-center text-sm text-zinc-400 hover:text-white`}
      >
        <span aria-hidden="true" className="mr-1">←</span>{backLabel}
      </Link>

      {isError && (
        <div className="mb-6 rounded-xl border border-amber-800 p-4">
          <p role="alert" className="text-amber-300">
            Could not refresh this profile. Showing available information.
          </p>
          <button
            type="button"
            onClick={() => refetch({ cancelRefetch: false })}
            disabled={isFetching}
            className={`${focusClassName} mt-2 min-h-11 text-red-400 disabled:opacity-50`}
          >
            {isFetching ? "Retrying..." : "Retry"}
          </button>
        </div>
      )}

      <PersonProfile key={person.id} person={person} />
    </div>
  );
}
