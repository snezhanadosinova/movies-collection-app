import { act, renderHook } from "@testing-library/react";
import {
  MemoryRouter,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useMovieFilter } from "@/features/movies/hooks/useMovieFilter";
import { useSearchMovies } from "@/features/movies/hooks/useSearchMovies";
import { useInfinitePopularMovies } from "@/features/movies/hooks/useInfinitePopularMovies";
import { useInfiniteDiscoverMovies } from "@/features/movies/hooks/useInfiniteDiscoverMovies";

vi.mock("@/features/movies/hooks/useSearchMovies", () => ({
  MIN_SEARCH_LENGTH: 2,
  useSearchMovies: vi.fn(),
}));

vi.mock("@/features/movies/hooks/useInfinitePopularMovies", () => ({
  useInfinitePopularMovies: vi.fn(),
}));

vi.mock("@/features/movies/hooks/useInfiniteDiscoverMovies", () => ({
  useInfiniteDiscoverMovies: vi.fn(),
}));

// Keep these tests focused on URL state rather than timer behavior.
vi.mock("@/hooks/useDebounce", () => ({
  useDebounce: (value) => value,
}));

beforeEach(() => {
  const queryState = {
    isLoading: false,
    isFetching: false,
    isError: false,
    isFetchNextPageError: false,
    isFetchingNextPage: false,
    hasNextPage: false,
    fetchNextPage: vi.fn(),
    refetch: vi.fn(),
  };

  vi.mocked(useSearchMovies).mockReturnValue({
    ...queryState,
    data: [],
  });

  vi.mocked(useInfinitePopularMovies).mockReturnValue({
    ...queryState,
    data: { pages: [{ results: [] }] },
  });

  vi.mocked(useInfiniteDiscoverMovies).mockReturnValue({
    ...queryState,
    data: { pages: [{ results: [] }] },
  });
});

function renderFilter(initialEntries, initialIndex) {
  function Wrapper({ children }) {
    return (
      <MemoryRouter
        initialEntries={initialEntries}
        initialIndex={initialIndex}
      >
        {children}
      </MemoryRouter>
    );
  }

  return renderHook(
    () => ({
      filter: useMovieFilter(),
      location: useLocation(),
      navigate: useNavigate(),
    }),
    { wrapper: Wrapper },
  );
}

describe("useMovieFilter URL state", () => {
  it("restores search and genre from the initial URL", () => {
    const { result } = renderFilter(["/?q=Alien&genre=27"]);

    expect(result.current.filter.search).toBe("Alien");
    expect(result.current.filter.selectedGenre).toBe("27");
    expect(result.current.filter.isSearching).toBe(true);

    expect(useSearchMovies).toHaveBeenLastCalledWith("Alien");
    expect(useInfiniteDiscoverMovies).toHaveBeenLastCalledWith("27");
  });

  it("updates search without removing other URL parameters", () => {
    const { result } = renderFilter(["/?genre=27&view=grid"]);

    act(() => {
      result.current.filter.setSearch("Alien");
    });

    const params = new URLSearchParams(
      result.current.location.search,
    );

    expect(params.get("q")).toBe("Alien");
    expect(params.get("genre")).toBe("27");
    expect(params.get("view")).toBe("grid");
    expect(result.current.filter.search).toBe("Alien");
  });

  it("removes the search parameter when the input is cleared", () => {
    const { result } = renderFilter(["/?q=Alien&genre=27"]);

    act(() => {
      result.current.filter.setSearch("");
    });

    const params = new URLSearchParams(
      result.current.location.search,
    );

    expect(params.has("q")).toBe(false);
    expect(params.get("genre")).toBe("27");
    expect(result.current.filter.isSearching).toBe(false);
  });

  it("replaces the current history entry while typing", () => {
    const { result } = renderFilter(
      ["/previous", "/"],
      1,
    );

    act(() => {
      result.current.filter.setSearch("Al");
    });

    act(() => {
      result.current.filter.setSearch("Alien");
    });

    act(() => {
      result.current.navigate(-1);
    });

    expect(result.current.location.pathname).toBe("/previous");
  });

  it("restores genre selection with back and forward navigation", () => {
    const { result } = renderFilter(["/?genre=27"]);

    act(() => {
      result.current.filter.setSelectedGenre("35");
    });

    expect(result.current.filter.selectedGenre).toBe("35");

    act(() => {
      result.current.navigate(-1);
    });

    expect(result.current.filter.selectedGenre).toBe("27");

    act(() => {
      result.current.navigate(1);
    });

    expect(result.current.filter.selectedGenre).toBe("35");
  });

  it("removes the genre parameter when all genres are selected", () => {
    const { result } = renderFilter(["/?genre=27"]);

    act(() => {
      result.current.filter.setSelectedGenre("");
    });

    expect(result.current.filter.selectedGenre).toBe("");

    expect(
      new URLSearchParams(result.current.location.search).has("genre"),
    ).toBe(false);
  });
});