import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  SEARCH_PAGE_LIMIT,
  useSearchMovies,
} from "@/features/movies/hooks/useSearchMovies";
import { searchMovies } from "@/features/movies/api/tmdbApi";

vi.mock("@/features/movies/api/tmdbApi", () => ({
  searchMovies: vi.fn(),
}));

let queryClient;

function Wrapper({ children }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

beforeEach(() => {
  vi.mocked(searchMovies).mockReset();

  queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
    },
  });
});

afterEach(() => {
  queryClient.clear();
});

describe("useSearchMovies", () => {
  it.each(["", " ", "a", " a "])(
    "does not search for a short normalized query: %j",
    async (query) => {
      const { result } = renderHook(() => useSearchMovies(query), {
        wrapper: Wrapper,
      });

      await act(async () => {});

      expect(result.current.fetchStatus).toBe("idle");
      expect(searchMovies).not.toHaveBeenCalled();
    },
  );

  it("trims the query and reuses cached results", async () => {
    const movies = [{ id: 1, title: "Alien" }];

    vi.mocked(searchMovies).mockResolvedValue({
      page: 1,
      total_pages: 1,
      results: movies,
    });

    const { result, rerender } = renderHook(
      ({ query }) => useSearchMovies(query),
      {
        wrapper: Wrapper,
        initialProps: { query: " Alien " },
      },
    );

    await waitFor(() => {
      expect(result.current.data).toEqual(movies);
    });

    expect(searchMovies).toHaveBeenCalledWith(
      "Alien",
      expect.any(AbortSignal),
      1,
    );

    rerender({ query: "Alien" });

    await act(async () => {});

    expect(searchMovies).toHaveBeenCalledTimes(1);
  });

  it("shows the first page while automatically loading the next", async () => {
    const firstMovie = { id: 1 };
    const secondMovie = { id: 2 };

    let resolveSecondPage;

    const pendingPage = new Promise((resolve) => {
      resolveSecondPage = resolve;
    });

    vi.mocked(searchMovies)
      .mockResolvedValueOnce({
        page: 1,
        total_pages: 2,
        results: [firstMovie],
      })
      .mockReturnValueOnce(pendingPage);

    const { result, unmount } = renderHook(() => useSearchMovies("Alien"), {
      wrapper: Wrapper,
    });

    try {
      await waitFor(() => {
        expect(searchMovies).toHaveBeenCalledTimes(2);
        expect(result.current.data).toEqual([firstMovie]);
        expect(result.current.isSearchingMore).toBe(true);
      });

      await act(async () => {
        resolveSecondPage({
          page: 2,
          total_pages: 2,
          results: [secondMovie],
        });

        await pendingPage;
      });

      await waitFor(() => {
        expect(result.current.data).toEqual([firstMovie, secondMovie]);

        expect(result.current.isSearchingMore).toBe(false);
        expect(result.current.searchLimitReached).toBe(false);
      });
    } finally {
      resolveSecondPage({
        page: 2,
        total_pages: 2,
        results: [],
      });

      unmount();
    }
  });

  it("stops at the configured page limit", async () => {
    vi.mocked(searchMovies).mockImplementation(
      async (_query, _signal, page) => ({
        page,
        total_pages: 20,
        results: [{ id: page }],
      }),
    );

    const { result } = renderHook(() => useSearchMovies("Love"), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current.searchLimitReached).toBe(true);
      expect(result.current.isFetching).toBe(false);
    });

    expect(searchMovies).toHaveBeenCalledTimes(SEARCH_PAGE_LIMIT);
    expect(result.current.data).toHaveLength(SEARCH_PAGE_LIMIT);
    expect(result.current.isSearchingMore).toBe(false);
  });

  it("preserves loaded results and stops automatic loading after a failure", async () => {
    const firstMovie = { id: 1 };

    vi.mocked(searchMovies)
      .mockResolvedValueOnce({
        page: 1,
        total_pages: 3,
        results: [firstMovie],
      })
      .mockRejectedValueOnce(new Error("Page failed"));

    const { result } = renderHook(() => useSearchMovies("Alien"), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.data).toEqual([firstMovie]);
    expect(result.current.isSearchingMore).toBe(false);
    expect(searchMovies).toHaveBeenCalledTimes(2);
  });

  it("aborts the previous query when the search text changes", async () => {
    vi.mocked(searchMovies)
      .mockImplementationOnce(() => new Promise(() => {}))
      .mockResolvedValueOnce({
        page: 1,
        total_pages: 1,
        results: [{ id: 2 }],
      });

    const { result, rerender } = renderHook(
      ({ query }) => useSearchMovies(query),
      {
        wrapper: Wrapper,
        initialProps: { query: "Alien" },
      },
    );

    await waitFor(() => {
      expect(searchMovies).toHaveBeenCalledTimes(1);
    });

    const previousSignal = vi.mocked(searchMovies).mock.calls[0][1];

    rerender({ query: "Batman" });

    await waitFor(() => {
      expect(result.current.data).toEqual([{ id: 2 }]);
    });

    expect(previousSignal.aborted).toBe(true);
  });
});
