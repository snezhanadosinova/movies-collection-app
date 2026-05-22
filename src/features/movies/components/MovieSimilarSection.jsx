/**
 * Movie Similar Section Component
 */
import { Link } from "react-router-dom";
import { getTmdbImageUrl } from "@/utils/tmdbImages";

export function MovieSimilarSection({ similar }) {
  if (!similar || similar.length === 0) return null;

  return (
    <div className="mx-auto max-w-7xl p-10">
      <h2 className="mb-4 text-2xl font-bold">Similar Movies</h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {similar.slice(0, 5).map((m) => (
          <Link key={m.id} to={`/movies/${m.id}`} className="group">
            <div className="overflow-hidden rounded-lg transition group-hover:scale-105">
              <img
                src={getTmdbImageUrl(m.poster_path, "w300")}
                alt={m.title}
                className="h-[300px] w-full object-cover"
                loading="lazy"
              />

              <div className="p-2">
                <p className="line-clamp-1 text-sm font-semibold">{m.title}</p>

                <p className="text-xs text-zinc-400">
                  ⭐ {m.vote_average?.toFixed(1)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
