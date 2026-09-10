import { describe, expect, it } from "vitest";
import { getTvCast, getTvRecommendations, formatTvDate } from "@/features/tv/utils/tvDetails";

describe("TV details adapters", () => {
  it("combines distinct character names from all seasons", () => {
    const result = getTvCast({ cast: [{ id: 1, name: "Actor", roles: [
      { character: "Alex" }, { character: "Alex" }, { character: "Sam" },
    ] }] });
    expect(result[0].character).toBe("Alex / Sam");
  });
  it("excludes the current series and repeated recommendations", () => {
    expect(getTvRecommendations({ id: 1, recommendations: { results: [
      { id: 1 }, { id: 2 }, { id: 2 }, { id: 3, adult: true },
    ] } })).toEqual([{ id: 2 }]);
  });
  it("handles missing cast and dates", () => {
    expect(getTvCast()).toEqual([]);
    expect(formatTvDate(null)).toBe("Not available");
    expect(formatTvDate("invalid")).toBe("Not available");
  });
});
