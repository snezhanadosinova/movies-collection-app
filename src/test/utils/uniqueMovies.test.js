import { describe, expect, it } from "vitest";

import { uniqueMovies } from "@/utils/uniqueMovies";

describe("uniqueMovies", () => {
  it("removes overlapping movies while preserving their first occurrence", () => {
    const firstMovie = { id: 100, title: "First movie" };
    const secondMovie = { id: 200, title: "Second movie" };
    const repeatedMovie = { id: 100, title: "Updated title" };
    const thirdMovie = { id: 300, title: "Third movie" };

    const movies = [firstMovie, secondMovie, repeatedMovie, thirdMovie];

    expect(uniqueMovies(movies)).toEqual([firstMovie, secondMovie, thirdMovie]);

    expect(movies).toEqual([
      firstMovie,
      secondMovie,
      repeatedMovie,
      thirdMovie,
    ]);
  });

  it("returns an empty array for an empty list", () => {
    expect(uniqueMovies([])).toEqual([]);
  });
});
