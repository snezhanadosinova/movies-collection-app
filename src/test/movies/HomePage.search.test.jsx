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
  default: () => <div data-testid="movie-grid-skeleton" />,
}));

vi.mock("@/components/common/InfiniteScrollTrigger", () => ({
  default: () => <div data-testid="infinite-scroll-trigger" />,
}));

const EMPTY_MESSAGE = "No movies found for these filters.";

const LIMIT_EMPTY_MESSAGE =
  "No matches in the checked results. Try a more specific title or another genre.";

const movie = {
  id: 1,
  title: "Alien",
};

let filterState;

function renderSearch(overrides = {}) {
  Object.assign(filterState, overrides);

  return render(<HomePage />);
}

beforeEach(() => {
  filterState = {
    search: "Alien",
    setSearch: vi.fn(),
    selectedGenre: "",
    setSelectedGenre: vi.fn(),
    movies: [],
    isLoading: false,
    isFetching: false,
    isError: false,
    isRefreshError: false,
    refetch: vi.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
    isFetchNextPageError: false,
    fetchNextPage: vi.fn(),
    pageTitle: "Search Results",
    isSearching: true,
    isSearchingMore: false,
    searchLimitReached: false,
    isSearchPaused: false,
  };

  vi.mocked(useMovieFilter).mockImplementation(() => filterState);
});

describe("HomePage search states", () => {
  it("shows a skeleton during the initial request without an empty message", () => {
    renderSearch({
      isLoading: true,
      isFetching: true,
    });

    expect(screen.queryByTestId("movie-grid-skeleton")).not.toBeNull();
    expect(screen.queryByText(EMPTY_MESSAGE)).toBeNull();
  });

  it("waits for later pages before showing the final empty state", () => {
    const { rerender } = renderSearch({
      isSearchingMore: true,
      isFetching: true,
    });

    expect(screen.queryByTestId("movie-grid-skeleton")).not.toBeNull();
    expect(screen.queryByText("Searching more results...")).not.toBeNull();
    expect(screen.queryByText(EMPTY_MESSAGE)).toBeNull();

    filterState = {
      ...filterState,
      isSearchingMore: false,
      isFetching: false,
    };

    rerender(<HomePage />);

    expect(screen.queryByTestId("movie-grid-skeleton")).toBeNull();
    expect(screen.queryByText("Searching more results...")).toBeNull();
    expect(screen.queryByText(EMPTY_MESSAGE)).not.toBeNull();
  });

  it("keeps existing movies visible while more search results load", () => {
    renderSearch({
      movies: [movie],
      isSearchingMore: true,
      isFetching: true,
    });

    expect(screen.queryByText("Alien")).not.toBeNull();
    expect(screen.queryByText("Searching more results...")).not.toBeNull();
    expect(screen.queryByTestId("movie-grid-skeleton")).toBeNull();
  });

  it("shows a paused message without claiming there are no matches", () => {
    renderSearch({
      isSearchPaused: true,
      isSearchingMore: true,
    });

    expect(
      screen.queryByText(
        "Search is paused. Waiting for an internet connection.",
      ),
    ).not.toBeNull();

    expect(screen.queryByTestId("movie-grid-skeleton")).not.toBeNull();
    expect(screen.queryByText(EMPTY_MESSAGE)).toBeNull();
    expect(screen.queryByText("Searching more results...")).toBeNull();
  });

  it("explains that an empty search was limited to the checked pages", () => {
    renderSearch({
      searchLimitReached: true,
    });

    expect(screen.queryByText(LIMIT_EMPTY_MESSAGE)).not.toBeNull();
    expect(screen.queryByText(EMPTY_MESSAGE)).toBeNull();
    expect(screen.queryByTestId("movie-grid-skeleton")).toBeNull();
  });

  it("shows the page limit alongside existing results", () => {
    renderSearch({
      movies: [movie],
      searchLimitReached: true,
    });

    expect(screen.queryByText("Alien")).not.toBeNull();

    expect(
      screen.queryByText(/Showing matches from the first 5 result pages/),
    ).not.toBeNull();

    expect(screen.queryByText(EMPTY_MESSAGE)).toBeNull();
  });

  it("preserves partial results after a failure and lets the user retry", () => {
    renderSearch({
      movies: [movie],
      isRefreshError: true,
    });

    expect(screen.queryByText("Alien")).not.toBeNull();

    expect(screen.getByRole("alert").textContent).toBe(
      "Could not finish the search. Showing available results.",
    );

    fireEvent.click(screen.getByRole("button", { name: "Retry" }));

    expect(filterState.refetch).toHaveBeenCalledWith({
      cancelRefetch: false,
    });
  });

  it("does not show a final empty message when the search failed midway", () => {
    renderSearch({
      isRefreshError: true,
    });

    expect(screen.queryByRole("alert")).not.toBeNull();
    expect(screen.queryByText(EMPTY_MESSAGE)).toBeNull();
    expect(screen.queryByText(LIMIT_EMPTY_MESSAGE)).toBeNull();
  });

  it("disables retry while the search is paused", () => {
    renderSearch({
      isRefreshError: true,
      isSearchPaused: true,
    });

    const retryButton = screen.getByRole("button", { name: "Retry" });

    expect(retryButton.disabled).toBe(true);

    fireEvent.click(retryButton);

    expect(filterState.refetch).not.toHaveBeenCalled();
  });

  it("does not offer manual or scroll-based pagination during search", () => {
    renderSearch({
      movies: [movie],
      hasNextPage: true,
    });

    expect(screen.queryByTestId("infinite-scroll-trigger")).toBeNull();
    expect(screen.queryByRole("button", { name: /load more/i })).toBeNull();

    expect(filterState.fetchNextPage).not.toHaveBeenCalled();
  });
});
