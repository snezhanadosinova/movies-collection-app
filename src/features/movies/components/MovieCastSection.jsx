/**
 * Movie Cast Section Component
 */
import { getTmdbImageUrl } from "@/utils/tmdbImages";

export function MovieCastSection({ cast }) {
  if (!cast || cast.length === 0) return null;

  return (
    <div className="mx-auto max-w-7xl p-10">
      <h2 className="mb-4 text-2xl font-bold">Cast</h2>

      <div className="flex gap-4 overflow-x-auto">
        {cast.slice(0, 10).map((actor) => (
          <div key={actor.id} className="min-w-[120px]">
            <img
              className="h-[150px] w-full rounded object-cover"
              src={getTmdbImageUrl(actor.profile_path, "w200")}
              alt={actor.name}
              loading="lazy"
            />
            <p className="text-sm">{actor.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
