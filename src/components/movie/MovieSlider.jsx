import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import MovieSlide from "./MovieSlide";
import { getMovieGenres, getPopularMovies } from "../../features/movies/api/tmdbApi";

export default function MovieSlider() {
  const [sliderMovies, setSliderMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        const [popularMovies, allGenres] = await Promise.all([
          getPopularMovies(),
          getMovieGenres(),
        ]);
          const sliderElements = popularMovies.results.slice(0,5);

        setSliderMovies(sliderElements);
        setGenres(allGenres);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (error) {
    return <div className="text-red-500 text-center py-10">{error}</div>;
  }

  const genreMap = Object.fromEntries(
    (genres || []).map((genre) => [genre.id, genre.name]),
  );

  return (
    <div className="py-6">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        effect="fade"
        loop={sliderMovies.length > 3}
        className="rounded-2xl"
      >
        {sliderMovies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <MovieSlide movie={movie} genreMap={genreMap} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
