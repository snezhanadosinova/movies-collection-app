import { describe, expect, it } from "vitest";
import { getFavoriteKey, getFavoriteEntries } from "@/features/favorites/utils/favoriteIdentity";

describe("favorite identity", () => {
  it("keeps legacy movies and separates TV IDs", () => {
    expect(getFavoriteKey(550)).toBe("550");
    expect(getFavoriteKey(550, "tv")).toBe("tv:550");
    expect(getFavoriteEntries({ 550: true, "tv:550": true })).toEqual([
      { key: "550", id: "550", mediaType: "movie" },
      { key: "tv:550", id: "550", mediaType: "tv" },
    ]);
  });
  it("ignores invalid stored entries", () => {
    expect(getFavoriteEntries({ bad: true, "tv:0": true, 12: false, "tv:42": true })).toEqual([
      { key: "tv:42", id: "42", mediaType: "tv" },
    ]);
  });
  it("rejects unsupported media types", () => {
    expect(() => getFavoriteKey(1, "person")).toThrow("Invalid favorite identity.");
  });
});
