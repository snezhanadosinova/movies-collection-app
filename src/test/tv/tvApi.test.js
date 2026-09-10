import { beforeEach, describe, expect, it, vi } from "vitest";
import api from "@/lib/axios";
import { getTvGenres, getTvPage } from "@/features/tv/api/tvApi";

vi.mock("@/lib/axios", () => ({ default: { get: vi.fn() } }));
beforeEach(() => vi.mocked(api.get).mockReset().mockResolvedValue({ data: { results: [] } }));

describe("TV API", () => {
  it.each([
    [{}, "/tv/popular", { page: 1 }],
    [{ genre: "18", page: 2 }, "/discover/tv", { page: 2, with_genres: "18" }],
    [{ search: "Dark", genre: "18" }, "/search/tv", { page: 1, query: "Dark" }],
  ])("uses the correct endpoint for %j", async (options, endpoint, params) => {
    const signal = new AbortController().signal;
    await getTvPage({ ...options, signal });
    expect(api.get).toHaveBeenCalledWith(endpoint, { signal, params });
  });

  it("loads the TV genre list", async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { genres: [{ id: 18, name: "Drama" }] } });
    expect(await getTvGenres()).toEqual([{ id: 18, name: "Drama" }]);
    expect(api.get).toHaveBeenCalledWith("/genre/tv/list", { signal: undefined });
  });
});
