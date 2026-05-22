import { usePopularMovies } from "./usePopularMovies";
import { useMovieGenres } from "./useMovieGenres";

/**
 * Custom hook for fetching slider movies and genres
 * Encapsulates data fetching logic for MovieSlider component
 */
export const useSliderMovies = () => {
  const { data: popularData, isLoading, isError } = usePopularMovies();
  const { data: genres = [] } = useMovieGenres();
  console.log(popularData?.pages[0]?.results);

  const sliderMovies = popularData?.pages[0]?.results?.slice(0, 5) || [];

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
