import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import HomePage from "@/features/movies/pages/HomePage";
import { useInfinitePopularMovies } from "@/features/movies/hooks/useInfinitePopularMovies";
import { getTvPage } from "@/features/tv/api/tvApi";

vi.mock("@/components/movie/MovieSlider", () => ({ default: () => <div aria-label="Featured movies" /> }));
vi.mock("@/features/movies/hooks/useInfinitePopularMovies", () => ({ useInfinitePopularMovies: vi.fn() }));
vi.mock("@/features/tv/api/tvApi", () => ({ getTvPage: vi.fn() }));

const clients = [];
beforeEach(() => {
  vi.mocked(useInfinitePopularMovies).mockReturnValue({
    data: { pages: [{ results: Array.from({ length: 9 }, (_, i) => ({ id: i + 1, title: `Movie ${i + 1}` })) }] },
    isPending: false, isError: false, refetch: vi.fn(),
  });
  vi.mocked(getTvPage).mockReset().mockResolvedValue({
    results: Array.from({ length: 9 }, (_, i) => ({ id: i + 1, name: `Series ${i + 1}` })),
  });
});
afterEach(() => {
  cleanup();
  clients.splice(0).forEach((client) => client.clear());
});

function CatalogDestination() {
  const location = useLocation();
  return <p>{location.pathname + location.search + location.hash}</p>;
}
function setup(path = "/") {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  clients.push(client);
  render(<QueryClientProvider client={client}><MemoryRouter initialEntries={[path]}>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/movies" element={<CatalogDestination />} />
    </Routes>
  </MemoryRouter></QueryClientProvider>);
  return client;
}

describe("Home discovery", () => {
  it("shows six items of each type and links to separate catalogs without search", async () => {
    const client = setup();
    // Await the in-flight query and its scheduled observer notification.
    await act(async () => {
      await client.fetchQuery({
        queryKey: ["tv", "home", "popular"],
        queryFn: ({ signal }) => getTvPage({ page: 1, signal }),
        staleTime: Infinity,
      });
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(screen.getByRole("link", { name: /Series 6/ })).not.toBeNull();
    expect(within(screen.getByRole("region", { name: "Popular Movies" })).getAllByRole("link")).toHaveLength(6);
    expect(within(screen.getByRole("region", { name: "Popular TV Series" })).getAllByRole("link")).toHaveLength(6);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.queryByRole("searchbox")).toBeNull();
    expect(screen.queryByRole("link", { name: /Movie 7/ })).toBeNull();
    expect(screen.queryByRole("link", { name: /Series 7/ })).toBeNull();
    expect(screen.getByRole("link", { name: /View all movies/ }).getAttribute("href")).toBe("/movies");
    expect(screen.getByRole("link", { name: /View all series/ }).getAttribute("href")).toBe("/tv");
    expect(getTvPage).toHaveBeenCalledWith({ page: 1, signal: expect.any(AbortSignal) });
  });
  it.each(["/?q=alien&genre=27#results", "/?genre=27", "/?q="])(
    "preserves a legacy catalog address: %s", async (path) => {
      setup(path);
      await screen.findByText(`/movies${path.slice(1)}`);
      expect(getTvPage).not.toHaveBeenCalled();
      expect(useInfinitePopularMovies).not.toHaveBeenCalled();
    },
  );
  it("keeps movies visible when TV fails and retries only TV", async () => {
    vi.mocked(getTvPage).mockRejectedValueOnce(new Error("Offline"));
    setup();
    await screen.findByRole("alert");
    expect(screen.getByRole("link", { name: /Movie 1/ })).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Retry popular tv series" }));
    await screen.findByRole("link", { name: /Series 1/ });
    await waitFor(() => expect(screen.queryByRole("alert")).toBeNull());
  });
});
