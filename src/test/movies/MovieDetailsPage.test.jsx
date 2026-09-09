import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import MovieDetailsPage from "@/features/movies/pages/MovieDetailsPage";
import { useMovieDetails } from "@/features/movies/hooks/useMovieDetails";

vi.mock("@/features/movies/hooks/useMovieDetails", () => ({
  useMovieDetails: vi.fn(),
}));

vi.mock("@/features/movies/components/MovieHeroSection", () => ({
  MovieHeroSection: ({ movie, loading }) =>
    loading ? (
      <div role="status" aria-label="Loading movie" />
    ) : (
      <h1>{movie.title}</h1>
    ),
}));

vi.mock("@/features/movies/components/MovieCastSection", () => ({
  MovieCastSection: () => <section aria-label="Cast" />,
}));

vi.mock("@/features/movies/components/MovieTrailerSection", () => ({
  MovieTrailerSection: () => null,
}));

vi.mock("@/features/movies/components/MovieSimilarSection", () => ({
  MovieSimilarSection: () => <section aria-label="Related movies" />,
}));

let queryState;

beforeEach(() => {
  queryState = {
    data: undefined,
    isLoading: false,
    isError: false,
    isInvalidId: false,
    error: null,
    refetch: vi.fn().mockResolvedValue(undefined),
    isFetching: false,
  };

  vi.mocked(useMovieDetails).mockReturnValue(queryState);
});

function renderPage(path = "/movies/550") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/movies/:id" element={<MovieDetailsPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("MovieDetailsPage", () => {
  it("shows the loading layout while fetching the movie", () => {
    queryState.isLoading = true;
    queryState.isFetching = true;

    renderPage();

    expect(
      screen.getByRole("status", { name: "Loading movie" }),
    ).not.toBeNull();

    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.queryByRole("button", { name: "Retry" })).toBeNull();
  });

  it("shows a not-found state for an invalid movie ID", () => {
    queryState.isInvalidId = true;

    renderPage("/movies/abc");

    expect(
      screen.getByRole("heading", { name: "Movie not found" }),
    ).not.toBeNull();

    expect(
      screen.getByRole("link", { name: "Browse movies" }).getAttribute("href"),
    ).toBe("/");

    expect(screen.queryByRole("button", { name: "Retry" })).toBeNull();
  });

  it("shows a not-found state when TMDB returns 404", () => {
    queryState.isError = true;
    queryState.error = {
      response: { status: 404 },
    };

    renderPage();

    expect(
      screen.getByRole("heading", { name: "Movie not found" }),
    ).not.toBeNull();

    expect(screen.queryByRole("button", { name: "Retry" })).toBeNull();
  });

  it("allows retrying an initial request failure", () => {
    queryState.isError = true;
    queryState.error = new Error("Network error");

    renderPage();

    expect(
      screen.getByRole("heading", {
        name: "Could not load this movie",
      }),
    ).not.toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Retry" }));

    expect(queryState.refetch).toHaveBeenCalledWith({
      cancelRefetch: false,
    });
  });

  it("prevents repeated clicks while retrying", () => {
    queryState.isFetching = true;

    renderPage();

    const button = screen.getByRole("button", {
      name: "Retrying...",
    });

    expect(button.disabled).toBe(true);

    fireEvent.click(button);

    expect(queryState.refetch).not.toHaveBeenCalled();
  });

  it("renders a movie when optional sections have no data", () => {
    queryState.data = {
      id: 550,
      title: "Example movie",
    };

    renderPage();

    expect(
      screen.getByRole("heading", { name: "Example movie" }),
    ).not.toBeNull();

    expect(screen.getByRole("region", { name: "Cast" })).not.toBeNull();

    expect(
      screen.getByRole("region", { name: "Related movies" }),
    ).not.toBeNull();

    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("keeps existing movie details visible after a refresh failure", () => {
    queryState.data = {
      id: 550,
      title: "Example movie",
    };

    queryState.isError = true;
    queryState.error = new Error("Refresh failed");

    renderPage();

    expect(
      screen.getByRole("heading", { name: "Example movie" }),
    ).not.toBeNull();

    expect(screen.getByRole("alert").textContent).toBe(
      "Could not refresh this movie. Showing previously loaded details.",
    );
  });
});
