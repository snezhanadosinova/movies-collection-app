import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { MovieCastSection } from "@/features/movies/components/MovieCastSection";

describe("MovieCastSection navigation", () => {
  it("opens the selected person's route", () => {
    render(
      <MemoryRouter initialEntries={["/movies/1"]}>
        <Routes>
          <Route
            path="/movies/:id"
            element={
              <MovieCastSection
                cast={[
                  {
                    id: 123,
                    name: "Alice",
                    character: "Alex",
                    profile_path: null,
                  },
                ]}
              />
            }
          />
          <Route
            path="/people/123"
            element={<h1>Alice profile</h1>}
          />
        </Routes>
      </MemoryRouter>,
    );

    const link = screen.getByRole("link", { name: /Alice/ });

    expect(link.getAttribute("href")).toBe("/people/123");

    fireEvent.click(link);

    expect(
      screen.queryByRole("heading", { name: "Alice profile" }),
    ).not.toBeNull();
  });
});