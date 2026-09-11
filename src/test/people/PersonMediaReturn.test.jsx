import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { MovieCastSection } from "@/features/movies/components/MovieCastSection";
import PersonDetailsPage from "@/features/people/pages/PersonDetailsPage";

vi.mock("@/features/people/hooks/usePersonDetails", () => ({
  usePersonDetails: () => ({ data: { id: 7, name: "Alice" }, isLoading: false }),
}));

describe("return from actor to media", () => {
  it.each([["/movies/42", "Back to movie"], ["/tv/42", "Back to series"]])(
    "returns to %s after opening cast", (path, label) => {
      render(
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path={path} element={<>
              <h1>Original title</h1>
              <MovieCastSection cast={[{ id: 7, name: "Alice" }]} />
            </>} />
            <Route path="/people/:id" element={<PersonDetailsPage />} />
          </Routes>
        </MemoryRouter>,
      );
      fireEvent.click(screen.getByRole("link", { name: /Alice/ }));
      const back = screen.getByRole("link", { name: label });
      expect(back.getAttribute("href")).toBe(path);
      fireEvent.click(back);
      expect(screen.getByRole("heading", { name: "Original title" })).not.toBeNull();
    },
  );
  it.each([undefined, "https://example.com", "//example.com", "/login"])(
    "uses the catalog without a valid source: %s", (fromMedia) => {
      render(<MemoryRouter initialEntries={[{ pathname: "/people/7", state: { fromMedia } }]}>
        <Routes><Route path="/people/:id" element={<PersonDetailsPage />} /></Routes>
      </MemoryRouter>);
      expect(screen.getByRole("link", { name: "Browse movies" }).getAttribute("href")).toBe("/");
    },
  );
});