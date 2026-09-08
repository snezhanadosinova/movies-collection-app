import MovieCard from "@/components/movie/MovieCard";
import { useFavoriteMovies } from "../hooks/useFavoriteMovies";
import PageLoader from "../../../components/common/PageLoader";

function FavoritesPage() {
  const { data: movies = [], isLoading, isError } = useFavoriteMovies();

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError) {
    return (
      <div className="p-6 text-red-400" role="alert">
        Could not load favorites. Please try again later.
      </div>
    );
  }

  if (!movies.length) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-zinc-400">
        <p className="text-xl">No favorites yet 💔</p>
        <p className="text-sm">Add movies you like to see them here</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <h1 className="mb-6 text-3xl font-bold text-white">Your Favorites</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default FavoritesPage;
