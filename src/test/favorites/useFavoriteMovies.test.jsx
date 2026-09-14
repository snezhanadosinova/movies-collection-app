import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useFavoriteMovies } from "@/features/favorites/hooks/useFavoriteMovies";
import { useFavorites } from "@/features/favorites/hooks/useFavorites";
import { getFavoriteMediaItem } from "@/features/favorites/api/getFavoriteMovies";

const session = vi.hoisted(() => ({ user: { uid: "alice" } }));
vi.mock("@/features/auth/context/useAuth", () => ({
  useAuth: () => session,
}));
vi.mock("@/features/favorites/hooks/useFavorites", () => ({ useFavorites: vi.fn() }));
vi.mock("@/features/favorites/api/getFavoriteMovies", () => ({ getFavoriteMediaItem: vi.fn() }));

beforeEach(() => {
  session.user = { uid: "alice" };
  vi.mocked(useFavorites).mockReturnValue({
    data: { 42: true, "tv:42": true }, isSuccess: true,
    isPending: false, isFetching: false, isError: false, refetch: vi.fn(),
  });
  vi.mocked(getFavoriteMediaItem).mockReset().mockImplementation(async (entry) => ({
    id: Number(entry.id), media_type: entry.mediaType,
  }));
});

function setup() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });
  function Wrapper({ children }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  }
  const hook = renderHook(() => useFavoriteMovies(), { wrapper: Wrapper });
  return { ...hook, dispose: () => { hook.unmount(); client.clear(); } };
}

describe("useFavoriteMovies mixed data", () => {
  it("keeps pending slots in order and ignores an old account's late result", async () => {
    let finish;
    const pending = new Promise((resolve) => { finish = resolve; });
    vi.mocked(getFavoriteMediaItem).mockReturnValue(pending);
    const { result, rerender, dispose } = setup();
    try {
      await waitFor(() => expect(getFavoriteMediaItem).toHaveBeenCalledTimes(2));
      expect(result.current.slots.map((slot) => slot.media_type)).toEqual(["movie", "tv"]);
      expect(result.current.slots.every((slot) => slot.isPending)).toBe(true);
      session.user = { uid: "bob" };
      vi.mocked(useFavorites).mockReturnValue({ data: {}, isSuccess: true, isPending: false });
      rerender();
      await act(async () => { finish({ id: 42, title: "Alice favorite" }); await pending; });
      expect(result.current.data).toEqual([]);
      expect(result.current.slots).toEqual([]);
    } finally { finish({ id: 42 }); dispose(); }
  });
  it("removes a title immediately and reuses the remaining title's cache", async () => {
    const { result, rerender, dispose } = setup();
    try {
      await waitFor(() => expect(result.current.data).toHaveLength(2));
      vi.mocked(useFavorites).mockReturnValue({
        data: { "tv:42": true }, isSuccess: true, isPending: false, isFetching: false,
      });
      rerender();
      expect(result.current.data).toEqual([{ id: 42, media_type: "tv" }]);
      expect(result.current.isLoading).toBe(false);
      expect(getFavoriteMediaItem).toHaveBeenCalledTimes(2);
    } finally { dispose(); }
  });

  it("preserves available titles when one details request fails", async () => {
    vi.mocked(getFavoriteMediaItem).mockImplementation(async (entry) => {
      if (entry.mediaType === "tv") throw new Error("Offline");
      return { id: 42, media_type: "movie" };
    });
    const { result, dispose } = setup();
    try {
      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.data).toEqual([{ id: 42, media_type: "movie" }]);
      expect(result.current.isLoading).toBe(false);
    } finally { dispose(); }
  });
});
