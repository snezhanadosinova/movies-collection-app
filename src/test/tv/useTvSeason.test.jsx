import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";
import { useTvSeason } from "@/features/tv/hooks/useTvSeason";
import { getTvSeason } from "@/features/tv/api/tvApi";

vi.mock("@/features/tv/api/tvApi", () => ({ getTvSeason: vi.fn() }));

function setup(id, number) {
  const client = new QueryClient();
  function Wrapper({ children }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  }
  const hook = renderHook(() => useTvSeason(id, number), { wrapper: Wrapper });
  return { ...hook, dispose: () => { hook.unmount(); client.clear(); } };
}

describe("useTvSeason", () => {
  it.each([["abc", "1"], ["42", "-1"], ["42", "abc"], ["42", undefined]])(
    "rejects invalid parameters %s / %s", (id, number) => {
      vi.mocked(getTvSeason).mockReset();
      const { result, dispose } = setup(id, number);
      try {
        expect(result.current.isInvalidParams).toBe(true);
        expect(getTvSeason).not.toHaveBeenCalled();
      } finally { dispose(); }
    },
  );

  it("accepts Specials and passes a cancellation signal", async () => {
    vi.mocked(getTvSeason).mockReset().mockResolvedValue({ name: "Specials", episodes: [] });
    const { result, dispose } = setup("42", "0");
    try {
      await waitFor(() => expect(result.current.data?.name).toBe("Specials"));
      expect(getTvSeason).toHaveBeenCalledWith("42", "0", expect.any(AbortSignal));
    } finally { dispose(); }
  });

  it("does not retry a missing season", async () => {
    vi.mocked(getTvSeason).mockReset().mockRejectedValue({ response: { status: 404 } });
    const { result, dispose } = setup("42", "1");
    try {
      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(getTvSeason).toHaveBeenCalledTimes(1);
    } finally { dispose(); }
  });
});
