import { beforeEach, describe, expect, it, vi } from "vitest";
import api from "@/lib/axios";
import { getFavoriteMovies, getFavoriteMediaItem } from "@/features/favorites/api/getFavoriteMovies";

vi.mock("@/lib/axios", () => ({ default: { get: vi.fn() } }));
beforeEach(() => {
  vi.mocked(api.get).mockReset();
});

describe("favorite media API", () => {
  it("loads the same numeric ID from separate movie and TV endpoints", async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { id: 550 } });
    const data = await getFavoriteMovies({ 550: true, "tv:550": true });
    expect(api.get).toHaveBeenCalledWith("/movie/550", { signal: undefined });
    expect(api.get).toHaveBeenCalledWith("/tv/550", { signal: undefined });
    expect(data.map((item) => item.media_type)).toEqual(["movie", "tv"]);
  });
  it("keeps a missing title identifiable so it can be removed", async () => {
    vi.mocked(api.get).mockRejectedValue({ response: { status: 404 } });
    expect(await getFavoriteMediaItem({ id: "42", mediaType: "tv" })).toEqual(
      expect.objectContaining({ id: 42, media_type: "tv", unavailable: true }),
    );
  });
  it("does not hide network failures as missing titles", async () => {
    vi.mocked(api.get).mockRejectedValue(new Error("Offline"));
    await expect(getFavoriteMediaItem({ id: "42", mediaType: "tv" })).rejects.toThrow("Offline");
  });
});
