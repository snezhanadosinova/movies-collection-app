import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTvCatalog } from "@/features/tv/hooks/useTvCatalog";
import { getTvGenres, getTvPage } from "@/features/tv/api/tvApi";

vi.mock("@/features/tv/api/tvApi", () => ({
  getTvGenres: vi.fn(),
  getTvPage: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(getTvGenres).mockReset().mockResolvedValue([{ id: 18, name: "Drama" }]);
  vi.mocked(getTvPage).mockReset();
});

function setup(url) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  function Wrapper({ children }) {
    return <MemoryRouter initialEntries={[url]}>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </MemoryRouter>;
  }
  const hook = renderHook(() => useTvCatalog(), { wrapper: Wrapper });
  return { ...hook, dispose: () => { hook.unmount(); client.clear(); } };
}

describe("useTvCatalog", () => {
  it("loads popular series without activating movie queries", async () => {
    vi.mocked(getTvPage).mockResolvedValue({ page: 1, total_pages: 1, results: [{ id: 1, name: "Example" }] });
    const { result, dispose } = setup("/tv");
    try {
      await waitFor(() => expect(result.current.series).toHaveLength(1));
      expect(getTvPage).toHaveBeenCalledWith(expect.objectContaining({ search: "", genre: "", page: 1 }));
      expect(result.current.title).toBe("Popular TV Series");
    } finally { dispose(); }
  });

  it("restores the selected genre and resolves its name", async () => {
    vi.mocked(getTvPage).mockResolvedValue({ page: 1, total_pages: 1, results: [] });
    const { result, dispose } = setup("/tv?genre=18");
    try {
      await waitFor(() => expect(result.current.title).toBe("Drama TV Series"));
      expect(getTvPage).toHaveBeenCalledWith(expect.objectContaining({ genre: "18" }));
    } finally { dispose(); }
  });

  it("continues searching when the matching genre is on a later page", async () => {
    let resolvePage;
    const pending = new Promise((resolve) => { resolvePage = resolve; });
    vi.mocked(getTvPage)
      .mockResolvedValueOnce({ page: 1, total_pages: 2, results: [{ id: 1, genre_ids: [35] }] })
      .mockReturnValueOnce(pending);
    const { result, dispose } = setup("/tv?q=example&genre=18");
    try {
      await waitFor(() => expect(getTvPage).toHaveBeenCalledTimes(2));
      expect(result.current.series).toEqual([]);
      expect(result.current.searchingMore).toBe(true);
      await act(async () => {
        resolvePage({ page: 2, total_pages: 2, results: [{ id: 2, genre_ids: [18] }] });
        await pending;
      });
      await waitFor(() => expect(result.current.series.map((item) => item.id)).toEqual([2]));
    } finally { resolvePage({ page: 2, total_pages: 2, results: [] }); dispose(); }
  });

  it("stops after five search pages and removes duplicate series", async () => {
    vi.mocked(getTvPage).mockImplementation(async ({ page }) => ({
      page, total_pages: 20, results: [{ id: 1, name: "Repeated" }],
    }));
    const { result, dispose } = setup("/tv?q=example");
    try {
      await waitFor(() => expect(result.current.limitReached).toBe(true));
      expect(getTvPage).toHaveBeenCalledTimes(5);
      expect(result.current.series).toHaveLength(1);
    } finally { dispose(); }
  });

  it("preserves the first page when a later request fails", async () => {
    vi.mocked(getTvPage)
      .mockResolvedValueOnce({ page: 1, total_pages: 2, results: [{ id: 1 }] })
      .mockRejectedValueOnce(new Error("Network error"));
    const { result, dispose } = setup("/tv?q=example");
    try {
      await waitFor(() => expect(result.current.query.isError).toBe(true));
      expect(result.current.series).toEqual([{ id: 1 }]);
      expect(result.current.searchingMore).toBe(false);
      expect(getTvPage).toHaveBeenCalledTimes(2);
    } finally { dispose(); }
  });
});
