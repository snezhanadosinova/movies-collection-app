import { describe, expect, it } from "vitest";

import { filterMoviesByGenre } from "@/utils/filterMoviesByGenre";

describe("filterMoviesByGenre", () => {
  const animation = {
    id: 1,
    title: "Animated adventure",
    genre_ids: [16, 12, 14, 35, 10751],
  };

  const horror = {
    id: 2,
    title: "Horror movie",
    genre_ids: [27, 53],
  };

  it("excludes search results that do not match the selected genre", () => {
    expect(filterMoviesByGenre([animation, horror], "27")).toEqual([horror]);
  });

  it("returns no matches when none of the movies has the selected genre", () => {
    expect(filterMoviesByGenre([animation], "27")).toEqual([]);
  });

  it("returns all movies when no genre is selected", () => {
    expect(filterMoviesByGenre([animation, horror], "")).toEqual([
      animation,
      horror,
    ]);
  });

  it("excludes movies with missing genre information when filtering", () => {
    expect(filterMoviesByGenre([{ id: 3 }], "27")).toEqual([]);
  });
});
