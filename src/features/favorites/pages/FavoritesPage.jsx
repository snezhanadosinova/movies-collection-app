import FavoritesSkeleton from "./FavoritesSkeleton";
import { useId, useState } from "react";
import FavoriteMediaCard from "@/components/media/FavoriteMediaCard";
import MovieGridSkeleton from "@/components/movie/MovieGridSkeleton";
import { useFavoriteMovies } from "../hooks/useFavoriteMovies";

export default function FavoritesPage() {
  const [filter, setFilter] = useState("all");
  const filterId = useId();
  const { data: items = [], slots, isLoading, isError, isFetching, refetch } = useFavoriteMovies();
  const visibleItems = (slots ?? items.map((item) => ({ ...item, item }))).filter((item) => filter === "all" || (item.media_type || "movie") === filter);

  if (isLoading && !visibleItems.length) return <FavoritesSkeleton />;
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 text-white sm:px-6">
      <h1 className="mb-6 text-3xl font-bold">Your Favorites</h1>
      <label htmlFor={filterId} className="mb-2 block text-sm">Title type</label>
      <select id={filterId} value={filter} onChange={(event) => setFilter(event.target.value)}
        className="mb-8 min-h-11 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 focus-visible:outline-2 focus-visible:outline-red-400">
        <option value="all">All</option>
        <option value="movie">Movies</option>
        <option value="tv">TV Series</option>
      </select>

      {isError && <div className="mb-6">
        <p role="alert" className="text-red-400">Could not load all favorites. Available titles are shown below.</p>
        <button type="button" onClick={refetch} disabled={isFetching}
          className="mt-3 min-h-11 rounded-xl bg-red-500 px-5 py-2 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-red-400">
          {isFetching ? "Retrying..." : "Retry"}
        </button>
      </div>}

      {isLoading && !visibleItems.length ? <MovieGridSkeleton /> : visibleItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {visibleItems.map((slot) => (
            <div key={`${slot.media_type || "movie"}:${slot.id}`}>
              {slot.item ? <FavoriteMediaCard item={slot.item} /> : (
                <div aria-busy={slot.isPending} className="min-h-[520px] rounded-xl bg-zinc-900">
                  <div aria-hidden="true" className="mb-2 h-4" />
                  <div aria-hidden="true" className={"h-[400px] rounded-xl bg-zinc-800 " + (slot.isPending ? "skeleton-pulse" : "")} />
                  <p className="p-4 text-sm text-zinc-400">
                    {slot.isError ? "Could not load this favorite. Use Retry above." : "Loading favorite..."}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : !isError && !isFetching ? (
        <div className="py-12 text-zinc-400">
          <p className="text-xl">{items.length ? "No favorites of this type yet." : "No favorites yet 💔"}</p>
          <p className="mt-2 text-sm">Add movies and TV series you like to see them here.</p>
        </div>
      ) : null}
      {!isLoading && isFetching && <p role="status" className="mt-6 text-zinc-400">Updating favorites...</p>}
    </div>
  );
}
