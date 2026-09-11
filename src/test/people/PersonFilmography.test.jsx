import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { PersonFilmography } from "@/features/people/components/PersonFilmography";

const cast = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  media_type: index === 9 ? "tv" : "movie",
  title: index === 9 ? undefined : `Movie ${index + 1}`,
  name: index === 9 ? "Example Series" : undefined,
  release_date: index === 9 ? undefined : "2024-01-01",
  first_air_date: index === 9 ? "2024-01-01" : undefined,
  character: "Alex",
}));

function renderFilmography(credits = { cast }) {
  return render(<PersonFilmography credits={credits} />, {
    wrapper: MemoryRouter,
  });
}

describe("PersonFilmography", () => {
  it("shows eight titles per page", () => {
    renderFilmography();

    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(8);
    expect(
      screen.getByRole("button", { name: "Previous" }).disabled,
    ).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(2);
    expect(
      screen.getByRole("button", { name: "Next" }).disabled,
    ).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: "Previous" }));

    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(8);
  });

  it("resets pagination when searching for a title", () => {
    renderFilmography();

    fireEvent.click(screen.getByRole("button", { name: "Next" }));

    fireEvent.change(
      screen.getByRole("searchbox", { name: "Search filmography" }),
      { target: { value: "Movie 3" } },
    );

    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(1);
    expect(
      screen.queryByRole("heading", { name: "Movie 3" }),
    ).not.toBeNull();

    expect(
      screen.queryByRole("navigation", { name: "Filmography pages" }),
    ).toBeNull();
  });

  it("filters series and links them to local details", () => {
    renderFilmography();

    fireEvent.change(
      screen.getByRole("combobox", { name: "Title type" }),
      { target: { value: "tv" } },
    );

    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(1);

    const link = screen.getByRole("link", {
      name: /Example Series/,
    });

    expect(link.getAttribute("href")).toBe(
      "/tv/10",
    );
    expect(link.getAttribute("target")).toBeNull();
  });

  it("links movies to their local details page", () => {
    renderFilmography({
      cast: [cast[0]],
    });

    expect(screen.getByRole("link").getAttribute("href")).toBe(
      "/movies/1",
    );
  });

  it("shows an empty state when no title matches", () => {
    renderFilmography();

    fireEvent.change(
      screen.getByRole("searchbox", { name: "Search filmography" }),
      { target: { value: "No matching title" } },
    );

    expect(
      screen.queryByText("No titles match these filters."),
    ).not.toBeNull();
  });
});
describe("PersonFilmography local navigation", () => {
  it.each([
    ["movie", "/movies/42", "Movie destination"],
    ["tv", "/tv/42", "Series destination"],
  ])("opens the correct route for %s", (mediaType, destination, heading) => {
    render(
      <MemoryRouter initialEntries={["/people/7"]}>
        <Routes>
          <Route path="/people/:id" element={
            <PersonFilmography credits={{ cast: [{
              id: 42, media_type: mediaType, title: "Example title", name: "Example title",
            }] }} />
          } />
          <Route path={destination} element={<h1>{heading}</h1>} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("link", { name: /Example title/ }));
    expect(screen.queryByRole("heading", { name: heading })).not.toBeNull();
  });

  it("keeps movie and TV destinations separate for the same ID", () => {
    renderFilmography({ cast: [
      { id: 42, media_type: "movie", title: "Example movie" },
      { id: 42, media_type: "tv", name: "Example series" },
    ] });
    expect(screen.getByRole("link", { name: /Example movie/ }).getAttribute("href")).toBe("/movies/42");
    expect(screen.getByRole("link", { name: /Example series/ }).getAttribute("href")).toBe("/tv/42");
  });
});