import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Navigation, Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import "swiper/css/effect-fade";

import MovieSlide from "./MovieSlide";
import { useSliderMovies } from "@/features/movies/hooks/useSliderMovies";

const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(callback) {
  const media = window.matchMedia(motionQuery);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
const readMotion = () => window.matchMedia(motionQuery).matches;
const serverMotion = () => true;

function FeaturedCarousel({ movies, genreMap }) {
  const reducedMotion = useSyncExternalStore(subscribeMotion, readMotion, serverMotion);
  const [playing, setPlaying] = useState(() => !readMotion());
  const [activeIndex, setActiveIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [swiper, setSwiper] = useState(null);
  const pointerIntent = useRef(null);
  const controlRef = useRef(null);
  const sliderId = useId();
  const canRotate = movies.length > 1;
  const rotating = playing && !reducedMotion && canRotate;

  useEffect(() => {
    if (!swiper || swiper.destroyed) return;
    if (rotating && !hovered) swiper.autoplay.start();
    else swiper.autoplay.stop();
  }, [swiper, rotating, hovered]);

  return (
    <section aria-label="Featured movies" aria-roledescription="carousel"
      className="relative pb-6"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={(event) => {
        // Explicit Play is allowed; moving focus to other controls stops rotation.
        if (!event.currentTarget.contains(event.relatedTarget) || event.target !== controlRef.current) {
          setPlaying(false);
        }
      }}>
      {canRotate && (
        <div className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 items-center gap-0 rounded-full bg-red-950/50 border border-red-950 px-1 backdrop-blur-sm">
          <button ref={controlRef} type="button" aria-controls={sliderId}
            disabled={reducedMotion}
            aria-label={rotating ? "Pause automatic slide rotation" : "Start automatic slide rotation"}
            onPointerDown={() => { pointerIntent.current = !rotating; }}
            onPointerCancel={() => { pointerIntent.current = null; }}
            onKeyDown={() => { pointerIntent.current = null; }}
            onClick={() => {
              setPlaying(pointerIntent.current ?? !rotating);
              pointerIntent.current = null;
            }}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-red-500 hover:text-red-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 disabled:opacity-60">
            <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24"
              className="h-4 w-4" fill="currentColor">
              {rotating ? (
                <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
              ) : (
                <path d="M8 5v14l11-7z" />
              )}
            </svg>

          </button>
          {movies.map((movie, index) => (
            <button key={movie.id} type="button"
              aria-label={`Show featured movie ${index + 1}: ${movie.title}`}
              aria-current={index === activeIndex ? "true" : undefined}
              aria-controls={sliderId}
              onClick={() => {
                setPlaying(false);
                if (swiper?.params.loop) swiper.slideToLoop(index);
                else swiper?.slideTo(index);
              }}
              className="flex h-9 w-6 shrink-0 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400">
              <span aria-hidden="true" className={index === activeIndex
                ? "h-2 w-2 rounded-full bg-red-500"
                : "h-2 w-2 rounded-full border border-red-500 bg-transparent"} />
            </button>
          ))}
          {reducedMotion && <p className="sr-only">Automatic rotation off: reduced motion enabled.</p>}
        </div>
      )}
      <Swiper id={sliderId}
        modules={[A11y, Navigation, Autoplay, EffectFade]}
        onSwiper={setSwiper}
        navigation={canRotate}
        onSlideChange={(instance) => setActiveIndex(instance.realIndex)}
        autoplay={{ delay: 5000, disableOnInteraction: true }}
        onBeforeInit={(instance) => {
          instance.params.autoplay.enabled = !reducedMotion && playing && canRotate;
        }}
        onTouchStart={() => setPlaying(false)}
        effect="fade" fadeEffect={{ crossFade: true }}
        speed={reducedMotion ? 0 : 300}
        loop={movies.length > 3}
        a11y={{
          prevSlideMessage: "Previous featured movie",
          nextSlideMessage: "Next featured movie",
          paginationBulletMessage: "Show featured movie {{index}}",
          slideLabelMessage: "{{index}} of {{slidesLength}}",
        }}
        className="[&_.swiper-button-next]:min-h-11 [&_.swiper-button-next]:min-w-11 [&_.swiper-button-prev]:min-h-11 [&_.swiper-button-prev]:min-w-11 [&_.swiper-button-next:focus-visible]:outline-2 [&_.swiper-button-prev:focus-visible]:outline-2 [&_.swiper-pagination-bullet:focus-visible]:outline-2">
        {movies.map((movie, index) => (
          <SwiperSlide key={movie.id}>
            {({ isActive }) => (
              <div inert={!isActive}>
                <MovieSlide movie={movie} genreMap={genreMap} priority={index === 0} />
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default function MovieSlider() {
  const { movies, genreMap, isLoading, isError } = useSliderMovies();
  if (isLoading || isError) {
    return (
      <div className="pb-6">
        <div className="flex h-[75vh] items-center justify-center bg-zinc-900"
          role={isError ? "alert" : "status"}>
          <span className={isError ? "text-red-400" : "sr-only"}>
            {isError ? "Failed to load featured movies." : "Loading featured movies..."}
          </span>
        </div>
      </div>
    );
  }
  if (movies.length === 0) return null;
  return <FeaturedCarousel movies={movies} genreMap={genreMap} />;
}
