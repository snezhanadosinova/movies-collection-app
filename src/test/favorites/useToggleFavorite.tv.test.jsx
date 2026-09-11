import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";
import { useToggleFavorite } from "@/features/favorites/hooks/useToggleFavorite";
import { addFavorite, removeFavorite } from "@/features/favorites/services/favoritesService";

vi.mock("@/features/auth/context/useAuth", () => ({
  useAuth: () => ({ user: { uid: "alice" } }),
}));
vi.mock("@/features/favorites/services/favoritesService", () => ({
  addFavorite: vi.fn(), removeFavorite: vi.fn(),
}));

describe("TV optimistic favorites", () => {
  it("rolls back a failed TV save without changing the movie with the same ID", async () => {
    const client = new QueryClient();
    const key = ["favorites", "alice"];
    client.setQueryData(key, { 42: true });
    let reject;
    const pending = new Promise((_resolve, rejectPromise) => { reject = rejectPromise; });
    vi.mocked(addFavorite).mockReturnValueOnce(pending);
    function Wrapper({ children }) {
      return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
    }
    const { result, unmount } = renderHook(() => useToggleFavorite(), { wrapper: Wrapper });
    try {
      act(() => result.current.mutate({ movieId: 42, mediaType: "tv", isFavorite: false }));
      await waitFor(() => expect(client.getQueryData(key)).toEqual({ 42: true, "tv:42": true }));
      expect(addFavorite).toHaveBeenCalledWith("alice", "tv:42");
      await act(async () => {
        reject(new Error("Save failed"));
        await pending.catch(() => {});
      });
      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(client.getQueryData(key)).toEqual({ 42: true });
    } finally {
      reject(new Error("Cleanup"));
      await pending.catch(() => {});
      unmount();
      client.clear();
    }
  });

  it("removes the TV entry without removing the legacy movie", async () => {
    const client = new QueryClient();
    const key = ["favorites", "alice"];
    client.setQueryData(key, { 42: true, "tv:42": true });
    vi.mocked(removeFavorite).mockResolvedValueOnce(undefined);
    function Wrapper({ children }) {
      return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
    }
    const { result, unmount } = renderHook(() => useToggleFavorite(), { wrapper: Wrapper });
    try {
      act(() => result.current.mutate({ movieId: 42, mediaType: "tv", isFavorite: true }));
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(removeFavorite).toHaveBeenCalledWith("alice", "tv:42");
      expect(client.getQueryData(key)).toEqual({ 42: true });
    } finally { unmount(); client.clear(); }
  });
});
