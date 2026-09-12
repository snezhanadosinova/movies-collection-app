import { Link } from "react-router-dom";

const linkClass = "inline-flex min-h-11 items-center rounded py-2 text-sm text-zinc-300 underline-offset-4 hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-400";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-zinc-800 bg-zinc-950 text-zinc-300">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_2fr]">
          <div>
            <Link to="/" className={linkClass + " text-lg font-semibold text-white"}>
              Movies Collection
            </Link>
            <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-400">
              Discover movies and TV series, explore the people behind them,
              and keep your favorites in one place.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <h2 className="mb-2 text-sm font-semibold text-white">Explore</h2>
            <ul>
              <li><Link to="/" className={linkClass}>Home</Link></li>
              <li><Link to="/movies" className={linkClass}>Movies</Link></li>
              <li><Link to="/tv" className={linkClass}>TV Series</Link></li>
            </ul>
          </nav>

          <div>
            <h2 className="mb-2 text-sm font-semibold text-white">About this project</h2>
            <p className="text-sm leading-6 text-zinc-400">
              A frontend learning and portfolio project built with React.
              Movie, TV, and person information is provided by TMDB.
            </p>
            <a href="https://www.themoviedb.org/" className={linkClass}>
              Visit TMDB <span aria-hidden="true" className="ml-1">↗</span>
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-800 pt-6 text-sm leading-6 text-zinc-400">
          <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
        </div>
      </div>
    </footer>
  );
}
