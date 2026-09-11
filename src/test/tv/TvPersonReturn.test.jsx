import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import TvDetailsPage from "@/features/tv/pages/TvDetailsPage";
import { PersonFilmography } from "@/features/people/components/PersonFilmography";

vi.mock("@/features/tv/hooks/useTvDetails", () => ({
  useTvDetails: () => ({
    data: { id: 42, name: "Example series" },
    isPending: false,
    isError: false,
    isInvalidId: false,
  }),
}));
vi.mock("@/components/movie/FavoriteButton", () => ({
  default: () => null,
}));

describe("TV return navigation", () => {
  it("returns to the actor who opened the series", () => {
    render(
      <MemoryRouter initialEntries={["/people/7"]}>
        <Routes>
          <Route path="/people/7" element={
            <>
              <h1>Actor profile</h1>
              <PersonFilmography credits={{ cast: [{
                id: 42, media_type: "tv", name: "Example series",
              }] }} />
            </>
          } />
          <Route path="/tv/:id" element={<TvDetailsPage />} />
        </Routes>
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole("link", { name: /Example series/ }));
    const back = screen.getByRole("link", { name: /Back to actor/ });
    expect(back.getAttribute("href")).toBe("/people/7");
    fireEvent.click(back);
    expect(screen.queryByRole("heading", { name: "Actor profile" })).not.toBeNull();
  });

  it.each([undefined, "https://example.com", "//example.com", "/login"])(
    "uses the TV catalog when no valid actor origin is available: %s",
    (fromPerson) => {
      render(
        <MemoryRouter initialEntries={[{ pathname: "/tv/42", state: { fromPerson } }]}>
          <Routes>
            <Route path="/tv/:id" element={<TvDetailsPage />} />
          </Routes>
        </MemoryRouter>,
      );
      expect(screen.getByRole("link", { name: /TV Series/ }).getAttribute("href")).toBe("/tv");
    },
  );
});
