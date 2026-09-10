import { describe, expect, it, vi } from "vitest";
import api from "@/lib/axios";
import { getTvSeason } from "@/features/tv/api/tvApi";

vi.mock("@/lib/axios", () => ({ default: { get: vi.fn() } }));

describe("getTvSeason", () => {
  it("requests the season number, including zero, with cancellation", async () => {
    const data = { name: "Specials", episodes: [] };
    vi.mocked(api.get).mockResolvedValue({ data });
    const signal = new AbortController().signal;
    expect(await getTvSeason("42", "0", signal)).toEqual(data);
    expect(api.get).toHaveBeenCalledWith("/tv/42/season/0", { signal });
  });
});
