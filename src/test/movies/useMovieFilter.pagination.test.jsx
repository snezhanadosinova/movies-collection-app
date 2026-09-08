import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";

import { useMovieFilter } from "@/features/movies/hooks/useMovieFilter";
import { getPopularMovies } from "@/features/movies/api/tmdbApi";

vi.mock("@/features/movies/api/tmdbApi", () => ({
  getPopularMovies: vi.fn(),
  discoverMovies: vi.fn(),
  searchMovies: vi.fn(),
}));

describe("useMovieFilter pagination", () => {
  it("preserves loaded movies after a next-page failure and appends them on retry", async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: Infinity,
        },
      },
    });

    const firstMovie = { id: 100, title: "First movie" };
    const secondMovie = { id: 200, title: "Second movie" };

    const firstPage = {
      page: 1,
      total_pages: 2,
      results: [firstMovie],
    };

    const secondPage = {
      page: 2,
      total_pages: 2,
      results: [secondMovie],
    };

    vi.mocked(getPopularMovies)
      .mockReset()
      .mockResolvedValueOnce(firstPage)
      .mockRejectedValueOnce(new Error("Next page failed"))
      .mockResolvedValueOnce(secondPage);

    function Wrapper({ children }) {
      return (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );
    }

    const { result, unmount } = renderHook(
      () => useMovieFilter(),
      { wrapper: Wrapper },
    );

    try {
      await waitFor(() => {
        expect(result.current.movies).toEqual([firstMovie]);
        expect(result.current.hasNextPage).toBe(true);
      });

      // Fail the second page after successfully loading the first.
      await act(async () => {
        await result.current.fetchNextPage({
          cancelRefetch: false,
        });
      });

      await waitFor(() => {
        expect(result.current.isFetchNextPageError).toBe(true);
        expect(result.current.isFetching).toBe(false);

        // The page must not enter the full-screen error state.
        expect(result.current.isError).toBe(false);
        expect(result.current.movies).toEqual([firstMovie]);
        expect(result.current.hasNextPage).toBe(true);
      });

      // Retry the failed page without discarding existing results.
      await act(async () => {
        await result.current.fetchNextPage({
          cancelRefetch: false,
        });
      });

      await waitFor(() => {
        expect(result.current.isFetchNextPageError).toBe(false);
        expect(result.current.movies).toEqual([
          firstMovie,
          secondMovie,
        ]);
        expect(result.current.hasNextPage).toBe(false);
      });

      const requestedPages = vi
        .mocked(getPopularMovies)
        .mock.calls.map(([page]) => page);

      expect(requestedPages).toEqual([1, 2, 2]);
    } finally {
      unmount();
      queryClient.clear();
    }
  });
});