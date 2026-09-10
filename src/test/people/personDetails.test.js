import { describe, expect, it } from "vitest";

import {
  getPersonCredits,
  getPersonLinks,
  formatPersonDate,
} from "@/features/people/utils/personDetails";

describe("person details", () => {
  it("merges acting and crew roles for the same movie", () => {
    const result = getPersonCredits({
      cast: [
        {
          id: 1,
          media_type: "movie",
          title: "Example",
          character: "Alex",
        },
      ],
      crew: [
        {
          id: 1,
          media_type: "movie",
          title: "Example",
          job: "Director",
        },
      ],
    });

    expect(result).toHaveLength(1);
    expect(result[0].roles).toEqual(["Alex", "Director"]);
  });

  it("keeps movies and series with the same ID separate", () => {
    const result = getPersonCredits({
      cast: [
        { id: 1, media_type: "movie", title: "Movie" },
        { id: 1, media_type: "tv", name: "Series" },
      ],
    });

    expect(result).toHaveLength(2);
    expect(new Set(result.map((title) => title.key)).size).toBe(2);
  });

  it("sorts newer titles first and places undated titles last", () => {
    const result = getPersonCredits({
      cast: [
        { id: 1, media_type: "movie", title: "Undated" },
        {
          id: 2,
          media_type: "movie",
          title: "Older",
          release_date: "2000-01-01",
        },
        {
          id: 3,
          media_type: "tv",
          name: "Newer",
          first_air_date: "2024-01-01",
        },
      ],
    });

    expect(result.map((title) => title.id)).toEqual([3, 2, 1]);
  });

  it("does not create unsafe homepage links", () => {
    const links = getPersonLinks({
      homepage: "javascript:alert(1)",
      external_ids: { imdb_id: "nm0000001" },
    });

    expect(links).toEqual([
      {
        label: "IMDb",
        href: "https://www.imdb.com/name/nm0000001",
      },
    ]);
  });

  it("handles missing dates and credits", () => {
    expect(formatPersonDate(null)).toBe("Not available");
    expect(getPersonCredits()).toEqual([]);
  });
});
