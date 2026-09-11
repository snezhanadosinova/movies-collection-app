import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import FavoritesPage from "@/features/favorites/pages/FavoritesPage";
import { useFavoriteMovies } from "@/features/favorites/hooks/useFavoriteMovies";

vi.mock("@/features/favorites/hooks/useFavoriteMovies", () => ({ useFavoriteMovies: vi.fn() }));
vi.mock("@/components/movie/FavoriteButton", () => ({
  default: ({ movieTitle }) => <button>Remove {movieTitle}</button>,
}));

beforeEach(() => {
  vi.mocked(useFavoriteMovies).mockReturnValue({
    data: [
      { id: 42, title: "Example movie", media_type: "movie" },
      { id: 42, name: "Example series", media_type: "tv" },
    ],
    isLoading: false, isError: false, isFetching: false, refetch: vi.fn(),
  });
});
describe("mixed favorites", () => {
  it("shows both types with separate destinations and filters them", () => {
    render(<FavoritesPage />, { wrapper: MemoryRouter });
    expect(screen.getByRole("link", { name: /Example movie/ }).getAttribute("href")).toBe("/movies/42");
    expect(screen.getByRole("link", { name: /Example series/ }).getAttribute("href")).toBe("/tv/42");
    fireEvent.change(screen.getByRole("combobox", { name: "Title type" }), { target: { value: "tv" } });
    expect(screen.queryByRole("link", { name: /Example movie/ })).toBeNull();
    expect(screen.queryByRole("link", { name: /Example series/ })).not.toBeNull();
    fireEvent.change(screen.getByRole("combobox", { name: "Title type" }), { target: { value: "movie" } });
    expect(screen.queryByRole("link", { name: /Example movie/ })).not.toBeNull();
    expect(screen.queryByRole("link", { name: /Example series/ })).toBeNull();
  });
});
