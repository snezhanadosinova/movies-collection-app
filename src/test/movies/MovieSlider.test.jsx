import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import MovieSlider from "@/components/movie/MovieSlider";

const state = vi.hoisted(() => ({
  start: vi.fn(), stop: vi.fn(), reduced: false, listener: null,
}));
vi.mock("swiper/react", async () => {
  const { useEffect } = await import("react");
  const instance = { autoplay: { start: state.start, stop: state.stop } };
  return {
    Swiper: ({ children, onSwiper }) => {
      useEffect(() => { onSwiper(instance); }, [onSwiper]);
      return <div>{children}</div>;
    },
    SwiperSlide: ({ children }) => children({ isActive: true }),
  };
});
vi.mock("@/components/movie/MovieSlide", () => ({
  default: ({ movie }) => <a href={`/movies/${movie.id}`}>{movie.title}</a>,
}));
vi.mock("@/features/movies/hooks/useSliderMovies", () => ({
  useSliderMovies: () => ({ movies: [{ id: 1, title: "First movie" }, { id: 2, title: "Second movie" }], genreMap: {} }),
}));
beforeEach(() => {
  state.reduced = false;
  vi.stubGlobal("matchMedia", () => ({
    matches: state.reduced,
    addEventListener: (_event, callback) => { state.listener = callback; },
    removeEventListener: () => { state.listener = null; },
  }));
});

afterEach(() => { vi.unstubAllGlobals(); });

describe("MovieSlider rotation controls", () => {
  it("stops and starts rotation with the toggle", () => {
    render(<MovieSlider />);
    expect(state.start).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Pause automatic slide rotation" }));
    expect(state.stop).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Start automatic slide rotation" }));
    expect(screen.getByRole("button", { name: "Pause automatic slide rotation" })).not.toBeNull();
  });
  it("stops on keyboard focus and does not restart when focus leaves", () => {
    render(<MovieSlider />);
    fireEvent.focus(screen.getByRole("link", { name: "First movie" }));
    fireEvent.blur(screen.getByRole("link", { name: "First movie" }));
    expect(screen.getByRole("button", { name: "Start automatic slide rotation" })).not.toBeNull();
    expect(state.stop).toHaveBeenCalled();
  });
  it("disables automatic rotation for reduced motion", () => {
    state.reduced = true;
    render(<MovieSlider />);
    expect(screen.getByRole("button", { name: "Start automatic slide rotation" }).disabled).toBe(true);
    expect(state.start).not.toHaveBeenCalled();
  });
  it("responds to a reduced-motion preference change", () => {
    render(<MovieSlider />);
    act(() => { state.reduced = true; state.listener(); });
    expect(state.stop).toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Start automatic slide rotation" }).disabled).toBe(true);
  });
});
