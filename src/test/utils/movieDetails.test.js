import { describe, expect, it } from "vitest";

import { selectRelatedMovies, selectTrailer } from "@/utils/movieDetails";

describe("selectTrailer", () => {
  it("prefers an official YouTube trailer", () => {
    const unofficial = {
      site: "YouTube",
      type: "Trailer",
      key: "abcdefghijk",
      official: false,
    };

    const official = {
      site: "YouTube",
      type: "Trailer",
      key: "12345678901",
      official: true,
    };

    expect(selectTrailer([unofficial, official])).toBe(official);
  });

  it("ignores unsupported providers, clips and invalid video keys", () => {
    expect(
      selectTrailer([
        {
          site: "Vimeo",
          type: "Trailer",
          key: "abcdefghijk",
        },
        {
          site: "YouTube",
          type: "Clip",
          key: "abcdefghijk",
        },
        {
          site: "YouTube",
          type: "Trailer",
          key: "invalid",
        },
      ]),
    ).toBeNull();
  });

  it("uses a valid unofficial trailer when no official trailer exists", () => {
    const trailer = {
      site: "YouTube",
      type: "Trailer",
      key: "abcdefghijk",
      official: false,
    };

    expect(selectTrailer([trailer])).toBe(trailer);
  });

  it("returns null when videos are unavailable", () => {
    expect(selectTrailer()).toBeNull();
  });
});

describe("selectRelatedMovies", () => {
  it("preserves recommendation order and removes duplicates and excluded movies", () => {
    const first = { id: 20, title: "First recommendation" };
    const second = { id: 30, title: "Second recommendation" };

    const movie = {
      id: 10,
      recommendations: {
        results: [
          { id: 10 },
          first,
          { id: 20 },
          { id: 40, adult: true },
          second,
        ],
      },
      similar: {
        results: [{ id: 50 }],
      },
    };

    expect(selectRelatedMovies(movie)).toEqual([first, second]);
  });

  it("falls back to similar movies when no usable recommendations exist", () => {
    const fallback = { id: 20 };

    expect(
      selectRelatedMovies({
        id: 10,
        recommendations: {
          results: [{ id: 10 }],
        },
        similar: {
          results: [fallback],
        },
      }),
    ).toEqual([fallback]);
  });

  it("limits the number of suggestions", () => {
    const results = Array.from({ length: 10 }, (_, index) => ({
      id: index + 2,
    }));

    expect(
      selectRelatedMovies({
        id: 1,
        recommendations: { results },
      }),
    ).toEqual(results.slice(0, 6));
  });

  it("returns an empty list when suggestions are unavailable", () => {
    expect(selectRelatedMovies({ id: 1 })).toEqual([]);
  });
});
