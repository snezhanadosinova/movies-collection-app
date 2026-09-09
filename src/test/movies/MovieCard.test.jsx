import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import MovieCard from "@/components/movie/MovieCard";
import FavoriteButton from "@/components/movie/FavoriteButton";

vi.mock("@/components/movie/FavoriteButton", () => ({
  default: vi.fn(),
}));

const movie = {
  id: 550,
  title: "Example movie",
  poster_path: "/poster.jpg",
  vote_average: 7.8,
};

beforeEach(() => {
  vi.mocked(FavoriteButton).mockReset();

  vi.mocked(FavoriteButton).mockImplementation(({ movieTitle }) => (
    <button type="button">Add to favorites: {movieTitle}</button>
  ));
});

function renderCard(value = movie) {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<MovieCard movie={value} />} />
        <Route path="/movies/:id" element={<h1>Movie destination</h1>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("MovieCard", () => {
  it("navigates to the movie when its link is clicked", async () => {
    renderCard();

    fireEvent.click(screen.getByRole("link", { name: /Example movie/ }));

    expect(
      await screen.findByRole("heading", {
        name: "Movie destination",
      }),
    ).not.toBeNull();
  });

  it("keeps the favorite button outside the link", () => {
    renderCard();

    const button = screen.getByRole("button", {
      name: "Add to favorites: Example movie",
    });

    expect(button.closest("a")).toBeNull();

    fireEvent.click(button);

    expect(
      screen.getByRole("heading", { name: "Example movie" }),
    ).not.toBeNull();

    expect(
      screen.queryByRole("heading", { name: "Movie destination" }),
    ).toBeNull();
  });

  it("passes the movie identity and compact variant to the shared button", () => {
    renderCard();

    const props = vi.mocked(FavoriteButton).mock.calls[0][0];

    expect(props).toEqual({
      movieId: 550,
      movieTitle: "Example movie",
      compact: true,
    });
  });

  it("renders fallbacks for missing image and rating", () => {
    renderCard({
      id: 100,
      title: "Movie without metadata",
    });

    expect(screen.getByText("Poster unavailable")).not.toBeNull();
    expect(screen.getByText("Not rated")).not.toBeNull();
  });

  it("renders nothing when the movie is missing", () => {
    const { container } = render(
      <MemoryRouter>
        <MovieCard movie={null} />
      </MemoryRouter>,
    );

    expect(container.childElementCount).toBe(0);
  });
});
