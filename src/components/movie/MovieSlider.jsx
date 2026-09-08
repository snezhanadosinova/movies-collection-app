import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import MovieSlide from "./MovieSlide";
import { useSliderMovies } from "@/features/movies/hooks/useSliderMovies";

export default function MovieSlider() {
  const { movies, genreMap, isLoading, isError } = useSliderMovies();

  if (isLoading) {
    return (
      <div className="py-6">
        <div className="h-[75vh] w-full rounded-2xl bg-zinc-900" role="status">
          <span className="sr-only">Loading featured movies...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-6">
        <div
          className="flex h-[75vh] items-center justify-center rounded-2xl bg-zinc-900 text-red-500"
          role="alert"
        >
          Failed to load featured movies.
        </div>
      </div>
    );
  }

  if (movies.length === 0) return null;

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
        {movies.map((movie, index) => (
          <SwiperSlide key={movie.id}>
            <MovieSlide
              movie={movie}
              genreMap={genreMap}
              priority={index === 0}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
