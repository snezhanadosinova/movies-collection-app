import { useInfinitePopularMovies } from "./useInfinitePopularMovies";
import { useMovieGenres } from "./useMovieGenres";

export const useSliderMovies = () => {
  const { data: popularData, isLoading, isError } = useInfinitePopularMovies();

  const { data: genres = [] } = useMovieGenres();

  const sliderMovies = popularData?.pages?.[0]?.results?.slice(0, 5) ?? [];

  const genreMap = Object.fromEntries(
    genres.map((genre) => [genre.id, genre.name]),
  );

  return {
    movies: sliderMovies,
    genreMap,
    isLoading,
    isError,
  };
};
