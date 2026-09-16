import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { MovieHeroSection } from "@/features/movies/components/MovieHeroSection";

vi.mock("@/components/movie/FavoriteButton", () => ({ default: () => null }));

function PersonDestination() {
  const location = useLocation();
  return <output data-testid="return-state">{JSON.stringify(location.state)}</output>;
}

function setup(crew) {
  render(
    <MemoryRouter initialEntries={[{
      pathname: "/movies/42",
      search: "?source=search",
      hash: "#details",
      state: { restoreScrollKey: "movie-scroll" },
    }]}>
      <Routes>
        <Route path="/movies/:id" element={
          <MovieHeroSection movie={{ id: 42, title: "Example", credits: { crew } }} />
        } />
        <Route path="/people/:id" element={<PersonDestination />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("Movie directors", () => {
  it("links directors by ID and preserves the movie return path and scroll key", () => {
    setup([{ id: 7, name: "Jane Director", job: "Director" }]);
    const link = screen.getByRole("link", { name: "Jane Director" });
    expect(link.getAttribute("href")).toBe("/people/7");
    fireEvent.click(link);
    expect(JSON.parse(screen.getByTestId("return-state").textContent)).toEqual({
      fromMedia: "/movies/42?source=search#details",
      fromMediaKey: "movie-scroll",
    });
  });

  it("deduplicates by ID without merging different directors with the same name", () => {
    setup([
      { id: 7, name: "Alex", job: "Director" },
      { id: 7, name: "Alex", job: "Director" },
      { id: 8, name: "Alex", job: "Director" },
      { id: 9, name: "Writer", job: "Writer" },
    ]);
    expect(screen.getAllByRole("link", { name: "Alex" }).map((link) => link.getAttribute("href")))
      .toEqual(["/people/7", "/people/8"]);
    expect(screen.queryByRole("link", { name: "Writer" })).toBeNull();
  });

  it("omits the section when there are no valid director profiles", () => {
    setup([{ name: "Missing ID", job: "Director" }]);
    expect(screen.queryByRole("heading", { name: "Directed by" })).toBeNull();
  });
});