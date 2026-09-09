import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { useMovieFilter } from "@/features/movies/hooks/useMovieFilter";
import { searchMovies } from "@/features/movies/api/tmdbApi";

vi.mock("@/features/movies/api/tmdbApi", () => ({
  searchMovies: vi.fn(),
}));

vi.mock("@/features/movies/hooks/useInfinitePopularMovies", () => ({
  useInfinitePopularMovies: () => ({
    data: undefined,
    isLoading: false,
    isError: false,
  }),
}));

vi.mock("@/features/movies/hooks/useInfiniteDiscoverMovies", () => ({
  useInfiniteDiscoverMovies: () => ({
    data: undefined,
    isLoading: false,
    isError: false,
  }),
}));

describe("useMovieFilter search integration", () => {
  it("finds a matching genre on the second search page", async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: Infinity,
        },
      },
    });

    const animation = {
      id: 1,
      title: "Animated movie",
      genre_ids: [16],
    };

    const horror = {
      id: 2,
      title: "Horror movie",
      genre_ids: [27],
    };

    let resolveSecondPage;

    const secondPagePromise = new Promise((resolve) => {
      resolveSecondPage = resolve;
    });

    vi.mocked(searchMovies)
      .mockReset()
      .mockResolvedValueOnce({
        page: 1,
        total_pages: 2,
        results: [animation],
      })
      .mockReturnValueOnce(secondPagePromise);

    function Wrapper({ children }) {
      return (
        <MemoryRouter initialEntries={["/?q=movie&genre=27"]}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </MemoryRouter>
      );
    }

    const { result, unmount } = renderHook(() => useMovieFilter(), {
      wrapper: Wrapper,
    });

    try {
      await waitFor(() => {
        expect(searchMovies).toHaveBeenCalledTimes(2);
        expect(result.current.movies).toEqual([]);
        expect(result.current.isSearchingMore).toBe(true);
      });

      expect(searchMovies).toHaveBeenNthCalledWith(
        2,
        "movie",
        expect.any(AbortSignal),
        2,
      );

      await act(async () => {
        resolveSecondPage({
          page: 2,
          total_pages: 2,
          results: [horror],
        });

        await secondPagePromise;
      });

      await waitFor(() => {
        expect(result.current.movies).toEqual([horror]);
        expect(result.current.isSearchingMore).toBe(false);
      });

      expect(result.current.isError).toBe(false);
      expect(result.current.searchLimitReached).toBe(false);
      expect(searchMovies).toHaveBeenCalledTimes(2);
    } finally {
      unmount();
      resolveSecondPage({
        page: 2,
        total_pages: 2,
        results: [],
      });
      queryClient.clear();
    }
  });
});
