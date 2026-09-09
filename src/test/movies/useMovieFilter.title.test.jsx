import { renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useMovieFilter } from "@/features/movies/hooks/useMovieFilter";
import { useMovieGenres } from "@/features/movies/hooks/useMovieGenres";

vi.mock("@/features/movies/hooks/useMovieGenres", () => ({
  useMovieGenres: vi.fn(),
}));

vi.mock("@/features/movies/hooks/useSearchMovies", () => ({
  MIN_SEARCH_LENGTH: 2,
  useSearchMovies: () => ({
    data: [],
    isLoading: false,
    isError: false,
  }),
}));

vi.mock("@/features/movies/hooks/useInfinitePopularMovies", () => ({
  useInfinitePopularMovies: () => ({
    data: { pages: [{ results: [] }] },
    isLoading: false,
    isError: false,
  }),
}));

vi.mock("@/features/movies/hooks/useInfiniteDiscoverMovies", () => ({
  useInfiniteDiscoverMovies: () => ({
    data: { pages: [{ results: [] }] },
    isLoading: false,
    isError: false,
  }),
}));

function renderFilter(url) {
  function Wrapper({ children }) {
    return <MemoryRouter initialEntries={[url]}>{children}</MemoryRouter>;
  }

  return renderHook(() => useMovieFilter(), {
    wrapper: Wrapper,
  });
}

beforeEach(() => {
  vi.mocked(useMovieGenres).mockReturnValue({
    data: [{ id: 27, name: "Horror" }],
  });
});

describe("useMovieFilter page title", () => {
  it("shows popular movies when no filter is selected", () => {
    const { result } = renderFilter("/");

    expect(result.current.pageTitle).toBe("Popular Movies");
  });

  it("uses the genre name while preserving its ID", () => {
    const { result } = renderFilter("/?genre=27");

    expect(result.current.pageTitle).toBe("Horror Movies");
    expect(result.current.selectedGenre).toBe("27");
  });

  it("keeps the search title when a genre is also selected", () => {
    const { result } = renderFilter("/?q=Alien&genre=27");

    expect(result.current.pageTitle).toBe("Search Results");
  });

  it("updates the title when genres finish loading", () => {
    vi.mocked(useMovieGenres).mockReturnValue({
      data: undefined,
    });

    const { result, rerender } = renderFilter("/?genre=27");

    expect(result.current.pageTitle).toBe("Filtered Movies");

    vi.mocked(useMovieGenres).mockReturnValue({
      data: [{ id: 27, name: "Horror" }],
    });

    rerender();

    expect(result.current.pageTitle).toBe("Horror Movies");
  });

  it("uses a readable fallback for an unknown genre", () => {
    const { result } = renderFilter("/?genre=999999");

    expect(result.current.pageTitle).toBe("Filtered Movies");
  });
});
