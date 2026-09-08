import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import HomePage from "@/features/movies/pages/HomePage";
import { useMovieFilter } from "@/features/movies/hooks/useMovieFilter";

vi.mock("@/features/movies/hooks/useMovieFilter", () => ({
  useMovieFilter: vi.fn(),
}));

vi.mock("@/components/movie/MovieSlider", () => ({
  default: () => null,
}));

vi.mock("@/components/movie/MovieSearch", () => ({
  default: () => null,
}));

vi.mock("@/components/movie/GenreFilter", () => ({
  default: () => null,
}));

vi.mock("@/components/movie/MovieGrid", () => ({
  default: ({ movies }) => (
    <ul aria-label="Movie results">
      {movies.map((movie) => (
        <li key={movie.id}>{movie.title}</li>
      ))}
    </ul>
  ),
}));

vi.mock("@/components/movie/MovieGridSkeleton", () => ({
  default: () => (
    <div role="status" aria-label="Loading movies" />
  ),
}));

vi.mock("@/components/common/InfiniteScrollTrigger", () => ({
  default: () => (
    <div data-testid="infinite-scroll-trigger" />
  ),
}));

let filterState;

beforeEach(() => {
  filterState = {
    search: "",
    setSearch: vi.fn(),
    selectedGenre: "",
    setSelectedGenre: vi.fn(),
    movies: [{ id: 100, title: "Existing movie" }],
    isLoading: false,
    isFetching: false,
    isError: false,
    isRefreshError: false,
    refetch: vi.fn().mockResolvedValue(undefined),
    hasNextPage: true,
    isFetchingNextPage: false,
    isFetchNextPageError: false,
    fetchNextPage: vi.fn().mockResolvedValue(undefined),
    pageTitle: "Popular Movies",
    isSearching: false,
  };

  vi.mocked(useMovieFilter).mockReturnValue(filterState);
});

describe("HomePage pagination", () => {
  it("allows retrying an initial loading failure", () => {
    filterState.movies = [];
    filterState.isError = true;

    render(<HomePage />);

    expect(screen.getByRole("alert").textContent).toBe(
      "Failed to load movies.",
    );

    expect(
      screen.queryByRole("list", { name: "Movie results" }),
    ).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Retry" }));

    expect(filterState.refetch).toHaveBeenCalledWith({
      cancelRefetch: false,
    });

    expect(filterState.fetchNextPage).not.toHaveBeenCalled();
  });

  it("preserves movies and allows retrying a failed next page", () => {
    filterState.isFetchNextPageError = true;

    render(<HomePage />);

    expect(screen.getByText("Existing movie")).not.toBeNull();

    expect(screen.getByRole("alert").textContent).toBe(
      "Could not load more movies.",
    );

    // Automatic pagination must stop after a next-page failure.
    expect(
      screen.queryByTestId("infinite-scroll-trigger"),
    ).toBeNull();

    expect(filterState.fetchNextPage).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Retry" }));

    expect(filterState.fetchNextPage).toHaveBeenCalledTimes(1);

    expect(filterState.fetchNextPage).toHaveBeenCalledWith({
      cancelRefetch: false,
    });

    expect(filterState.refetch).not.toHaveBeenCalled();
  });

  it("keeps movies visible while loading the next page", () => {
    filterState.isFetching = true;
    filterState.isFetchingNextPage = true;

    render(<HomePage />);

    expect(screen.getByText("Existing movie")).not.toBeNull();

    expect(
      screen.getByRole("status", { name: "Loading movies" }),
    ).not.toBeNull();

    expect(
      screen.queryByTestId("infinite-scroll-trigger"),
    ).toBeNull();

    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("enables automatic pagination when another page is available", () => {
    render(<HomePage />);

    expect(
      screen.getByTestId("infinite-scroll-trigger"),
    ).not.toBeNull();
  });

  it("removes the trigger after the last page", () => {
    filterState.hasNextPage = false;

    render(<HomePage />);

    expect(screen.getByText("Existing movie")).not.toBeNull();

    expect(
      screen.queryByTestId("infinite-scroll-trigger"),
    ).toBeNull();

    expect(
      screen.queryByRole("button", { name: "Retry" }),
    ).toBeNull();
  });
});