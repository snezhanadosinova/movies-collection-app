import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { useSearchMovies } from "@/features/movies/hooks/useSearchMovies";
import { searchMovies } from "@/features/movies/api/tmdbApi";

vi.mock("@/features/movies/api/tmdbApi", () => ({
  searchMovies: vi.fn(),
}));

let queryClient;

function Wrapper({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

beforeEach(() => {
  vi.mocked(searchMovies).mockReset();

  queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 5 * 60 * 1000,
      },
    },
  });
});

afterEach(() => {
  queryClient.clear();
});

describe("useSearchMovies", () => {
  it.each(["", " ", "a", " a "])(
    "does not search when the normalized query is too short: %j",
    async (query) => {
      const { result } = renderHook(
        () => useSearchMovies(query),
        { wrapper: Wrapper },
      );

      await act(async () => {});

      expect(result.current.fetchStatus).toBe("idle");
      expect(searchMovies).not.toHaveBeenCalled();
    },
  );

  it("trims the query and reuses fresh cached results", async () => {
    const movies = [{ id: 550, title: "Batman" }];

    vi.mocked(searchMovies).mockResolvedValue(movies);

    const { result, rerender } = renderHook(
      ({ query }) => useSearchMovies(query),
      {
        wrapper: Wrapper,
        initialProps: { query: " Batman " },
      },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(searchMovies).toHaveBeenCalledWith(
      "Batman",
      expect.any(AbortSignal),
    );

    expect(result.current.data).toEqual(movies);

    rerender({ query: "Batman" });

    await act(async () => {});

    expect(searchMovies).toHaveBeenCalledTimes(1);
    expect(result.current.data).toEqual(movies);
  });

  it("does not display previous results while a new search is pending", async () => {
    const previousMovies = [{ id: 550, title: "Batman" }];
    const nextMovies = [{ id: 100, title: "Alien" }];

    let resolveSearch;

    const pendingSearch = new Promise((resolve) => {
      resolveSearch = resolve;
    });

    vi.mocked(searchMovies)
      .mockResolvedValueOnce(previousMovies)
      .mockReturnValueOnce(pendingSearch);

    const { result, rerender, unmount } = renderHook(
      ({ query }) => useSearchMovies(query),
      {
        wrapper: Wrapper,
        initialProps: { query: "Batman" },
      },
    );

    try {
      await waitFor(() => {
        expect(result.current.data).toEqual(previousMovies);
      });

      rerender({ query: "Alien" });

      await waitFor(() => {
        expect(searchMovies).toHaveBeenCalledWith(
          "Alien",
          expect.any(AbortSignal),
        );

        expect(result.current.isLoading).toBe(true);
        expect(result.current.data).toBeUndefined();
      });

      await act(async () => {
        resolveSearch(nextMovies);
        await pendingSearch;
      });

      await waitFor(() => {
        expect(result.current.data).toEqual(nextMovies);
      });
    } finally {
      resolveSearch(nextMovies);
      unmount();
    }
  });

  it("aborts the signal when the search is no longer observed", async () => {
    vi.mocked(searchMovies).mockImplementation(
      () => new Promise(() => {}),
    );

    const { unmount } = renderHook(
      () => useSearchMovies("Batman"),
      { wrapper: Wrapper },
    );

    await waitFor(() => {
      expect(searchMovies).toHaveBeenCalledTimes(1);
    });

    const signal = vi.mocked(searchMovies).mock.calls[0][1];

    expect(signal.aborted).toBe(false);

    unmount();

    expect(signal.aborted).toBe(true);
  });
});