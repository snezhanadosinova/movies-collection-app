import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import MovieSlide from "./MovieSlide";
import { useSliderMovies } from "../../features/movies/hooks/useSliderMovies";

export default function MovieSlider() {
  const { movies, genreMap, isLoading, isError } = useSliderMovies();

  if (isLoading) return <p className="py-6">Loading...</p>;

  if (isError) {
    return (
      <div className="text-red-500 text-center py-10">
        Failed to load slider
      </div>
    );
  }

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
        loop={movies.length > 3}
        className="rounded-2xl"
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <MovieSlide movie={movie} genreMap={genreMap} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
