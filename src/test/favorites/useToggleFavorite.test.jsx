import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";

import { useToggleFavorite } from "@/features/favorites/hooks/useToggleFavorite";
import { addFavorite } from "@/features/favorites/services/favoritesService";

vi.mock("@/features/auth/context/useAuth", () => ({
  useAuth: () => ({
    user: { uid: "test-user" },
    loading: false,
  }),
}));

vi.mock("@/features/favorites/services/favoritesService", () => ({
  addFavorite: vi.fn(),
  removeFavorite: vi.fn(),
}));

describe("useToggleFavorite", () => {
  it("adds the movie to the cache before the save completes", async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    const queryKey = ["favorites", "test-user"];

    queryClient.setQueryData(queryKey, {});

    let resolveSave;

    const pendingSave = new Promise((resolve) => {
      resolveSave = resolve;
    });

    vi.mocked(addFavorite).mockReturnValueOnce(pendingSave);

    function Wrapper({ children }) {
      return (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );
    }

    const { result, unmount } = renderHook(() => useToggleFavorite(), {
      wrapper: Wrapper,
    });

    try {
      act(() => {
        result.current.mutate({
          movieId: 550,
          isFavorite: false,
        });
      });

      // adds the movie to the cache before the save completes
      await waitFor(() => {
        expect(addFavorite).toHaveBeenCalledWith("test-user", 550);

        expect(queryClient.getQueryData(queryKey)).toEqual({
          550: true,
        });

        expect(result.current.isPending).toBe(true);
      });

      //successful login simulation
      await act(async () => {
        resolveSave();
        await pendingSave;
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(queryClient.getQueryData(queryKey)).toEqual({
        550: true,
      });
    } finally {
      resolveSave();
      unmount();
      queryClient.clear();
    }
  });

  it("restores the previous favorite state when saving fails", async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    const queryKey = ["favorites", "test-user"];

    queryClient.setQueryData(queryKey, {
      100: true,
    });

    let rejectSave;

    const pendingSave = new Promise((_resolve, reject) => {
      rejectSave = reject;
    });

    vi.mocked(addFavorite).mockReturnValueOnce(pendingSave);

    function Wrapper({ children }) {
      return (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );
    }

    const { result, unmount } = renderHook(() => useToggleFavorite(), {
      wrapper: Wrapper,
    });

    try {
      act(() => {
        result.current.mutate({
          movieId: 550,
          isFavorite: false,
        });
      });

      // Confirm the optimistic update before rejecting the save.
      await waitFor(() => {
        expect(addFavorite).toHaveBeenCalledWith("test-user", 550);

        expect(queryClient.getQueryData(queryKey)).toEqual({
          100: true,
          550: true,
        });

        expect(result.current.isPending).toBe(true);
      });

      await act(async () => {
        rejectSave(new Error("Save failed"));
        await pendingSave.catch(() => {});
      });

      // Restore the affected movie and preserve existing favorites.
      await waitFor(() => {
        expect(result.current.isError).toBe(true);

        expect(queryClient.getQueryData(queryKey)).toEqual({
          100: true,
        });
      });
    } finally {
      // Settle the controlled promise even if an assertion fails.
      rejectSave(new Error("Test cleanup"));
      await pendingSave.catch(() => {});
      unmount();
      queryClient.clear();
    }
  });

  it("preserves another successful favorite when an earlier save fails", async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    const queryKey = ["favorites", "test-user"];

    queryClient.setQueryData(queryKey, {});

    let rejectFirstSave;
    let resolveSecondSave;

    const firstSave = new Promise((_resolve, reject) => {
      rejectFirstSave = reject;
    });

    const secondSave = new Promise((resolve) => {
      resolveSecondSave = resolve;
    });

    vi.mocked(addFavorite)
      .mockImplementationOnce(() => firstSave)
      .mockImplementationOnce(() => secondSave);

    function Wrapper({ children }) {
      return (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );
    }

    const { result, unmount } = renderHook(
      () => ({
        first: useToggleFavorite(),
        second: useToggleFavorite(),
      }),
      { wrapper: Wrapper },
    );

    try {
      act(() => {
        result.current.first.mutate({
          movieId: 100,
          isFavorite: false,
        });
      });

      // Ensure the first operation starts before adding the second movie.
      await waitFor(() => {
        expect(addFavorite).toHaveBeenCalledWith("test-user", 100);
        expect(queryClient.getQueryData(queryKey)).toEqual({
          100: true,
        });
      });

      act(() => {
        result.current.second.mutate({
          movieId: 200,
          isFavorite: false,
        });
      });

      await waitFor(() => {
        expect(addFavorite).toHaveBeenCalledWith("test-user", 200);
        expect(queryClient.getQueryData(queryKey)).toEqual({
          100: true,
          200: true,
        });
      });

      // Complete the second save while the first is still pending.
      await act(async () => {
        resolveSecondSave();
        await secondSave;
      });

      await waitFor(() => {
        expect(result.current.second.isSuccess).toBe(true);
        expect(result.current.first.isPending).toBe(true);
      });

      // Fail the earlier operation after the second one has succeeded.
      await act(async () => {
        rejectFirstSave(new Error("First save failed"));
        await firstSave.catch(() => {});
      });

      await waitFor(() => {
        expect(result.current.first.isError).toBe(true);
        expect(queryClient.getQueryData(queryKey)).toEqual({
          200: true,
        });
      });
    } finally {
      rejectFirstSave(new Error("Test cleanup"));
      resolveSecondSave();

      await Promise.allSettled([firstSave, secondSave]);

      unmount();
      queryClient.clear();
    }
  });
});
