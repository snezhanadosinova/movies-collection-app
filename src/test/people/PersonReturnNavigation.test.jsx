import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MovieDetailsPage from "@/features/movies/pages/MovieDetailsPage";
import TvDetailsPage from "@/features/tv/pages/TvDetailsPage";
import TvSeasonPage from "@/features/tv/pages/TvSeasonPage";
import { PersonFilmography } from "@/features/people/components/PersonFilmography";
import { useTvSeason } from "@/features/tv/hooks/useTvSeason";

vi.mock("@/components/movie/FavoriteButton", () => ({ default: () => null }));
vi.mock("@/features/movies/hooks/useMovieDetails", () => ({
  useMovieDetails: () => ({ data: { id: 42, title: "Example movie" }, isLoading: false }),
}));
vi.mock("@/features/tv/hooks/useTvDetails", () => ({
  useTvDetails: () => ({
    data: { id: 42, name: "Example series", seasons: [{ season_number: 0, name: "Specials" }] },
    isPending: false,
  }),
}));
vi.mock("@/features/tv/hooks/useTvSeason", () => ({ useTvSeason: vi.fn() }));

beforeEach(() => {
  vi.mocked(useTvSeason).mockReturnValue({
    data: { name: "Specials", episodes: [] }, isPending: false,
  });
});

function setup(initialEntry = "/people/7") {
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/people/:id" element={<>
          <h1>Actor profile</h1>
          <PersonFilmography credits={{ cast: [
            { id: 42, media_type: "movie", title: "Example movie" },
            { id: 42, media_type: "tv", name: "Example series" },
          ] }} />
        </>} />
        <Route path="/movies/:id" element={<MovieDetailsPage />} />
        <Route path="/tv/:id" element={<TvDetailsPage />} />
        <Route path="/tv/:id/seasons/:seasonNumber" element={<TvSeasonPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("person return across media routes", () => {
  it("opens a movie from filmography and returns to the actor", () => {
    setup();
    fireEvent.click(screen.getByRole("link", { name: /Example movie/ }));
    const back = screen.getByRole("link", { name: "Back to actor" });
    expect(back.getAttribute("href")).toBe("/people/7");
    back.focus();
    expect(document.activeElement).toBe(back);
    fireEvent.click(back);
    expect(screen.getByRole("heading", { name: "Actor profile" })).not.toBeNull();
  });

  it.each([false, true])("keeps the actor origin through a season (missing: %s)", (missing) => {
    if (missing) {
      vi.mocked(useTvSeason).mockReturnValue({
        isPending: false, isError: true, error: { response: { status: 404 } },
      });
    }
    setup();
    fireEvent.click(screen.getByRole("link", { name: /Example series/ }));
    fireEvent.click(screen.getByRole("link", { name: /Specials/ }));
    fireEvent.click(screen.getByRole("link", { name: /Back to series/ }));
    const back = screen.getByRole("link", { name: /Back to actor/ });
    expect(back.getAttribute("href")).toBe("/people/7");
    fireEvent.click(back);
    expect(screen.getByRole("heading", { name: "Actor profile" })).not.toBeNull();
  });

  it("preserves restored history state when opening a season", () => {
    setup({ pathname: "/tv/42/seasons/0", state: { fromPerson: "/people/7?type=tv#credits" } });
    fireEvent.click(screen.getByRole("link", { name: /Back to series/ }));
    expect(screen.getByRole("link", { name: /Back to actor/ }).getAttribute("href"))
      .toBe("/people/7?type=tv#credits");
  });

  it("uses the catalog after opening a season directly", () => {
    setup("/tv/42/seasons/0");
    fireEvent.click(screen.getByRole("link", { name: /Back to series/ }));
    expect(screen.getByRole("link", { name: /TV Series/ }).getAttribute("href")).toBe("/tv");
  });
});
