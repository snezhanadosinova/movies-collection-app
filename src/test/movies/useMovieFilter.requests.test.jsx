import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useMovieFilter } from "@/features/movies/hooks/useMovieFilter";
import { useInfinitePopularMovies } from "@/features/movies/hooks/useInfinitePopularMovies";
import { getPopularMovies, discoverMovies, searchMovies, getMovieGenres } from "@/features/movies/api/tmdbApi";

vi.mock("@/features/movies/api/tmdbApi", () => ({
  getPopularMovies: vi.fn(), discoverMovies: vi.fn(), searchMovies: vi.fn(), getMovieGenres: vi.fn(),
}));
const clients = [];
beforeEach(() => {
  const page = { page: 1, total_pages: 1, results: [{ id: 1, title: "Movie", genre_ids: [27] }] };
  vi.mocked(getPopularMovies).mockReset().mockResolvedValue(page);
  vi.mocked(discoverMovies).mockReset().mockResolvedValue(page);
  vi.mocked(searchMovies).mockReset().mockResolvedValue(page);
  vi.mocked(getMovieGenres).mockReset().mockResolvedValue([{ id: 27, name: "Horror" }]);
});
afterEach(() => {
  cleanup();
  clients.splice(0).forEach((client) => client.clear());
});
function setup(path, hook = useMovieFilter) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });
  clients.push(client);
  function Wrapper({ children }) {
    return <MemoryRouter initialEntries={[path]}><QueryClientProvider client={client}>{children}</QueryClientProvider></MemoryRouter>;
  }
  return renderHook(hook, { wrapper: Wrapper });
}

describe("movie catalog request selection", () => {
  it.each([
    ["/movies", 1, 0, 0],
    ["/movies?genre=27", 0, 1, 0],
    ["/movies?q=alien", 0, 0, 1],
    ["/movies?q=alien&genre=27", 0, 0, 1],
    ["/movies?q=a&genre=27", 0, 1, 0],
  ])("requests only the active source at %s", async (path, popular, discover, search) => {
    const { result } = setup(path);
    await waitFor(() => expect(result.current.movies).toHaveLength(1));
    expect(getPopularMovies).toHaveBeenCalledTimes(popular);
    expect(discoverMovies).toHaveBeenCalledTimes(discover);
    expect(searchMovies).toHaveBeenCalledTimes(search);
  });

  it("reuses popular results when returning from a genre filter", async () => {
    const { result } = setup("/movies");
    await waitFor(() => expect(result.current.movies).toHaveLength(1));
    act(() => result.current.setSelectedGenre("27"));
    await waitFor(() => expect(discoverMovies).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(result.current.isFetching).toBe(false));
    act(() => result.current.setSelectedGenre(""));
    expect(result.current.movies).toHaveLength(1);
    expect(getPopularMovies).toHaveBeenCalledTimes(1);
  });

  it("keeps popular queries enabled by default for Home and the slider", async () => {
    const { result } = setup("/", useInfinitePopularMovies);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getPopularMovies).toHaveBeenCalledTimes(1);
  });
});
