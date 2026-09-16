import { fireEvent, render, screen } from "@testing-library/react";
import { Link, MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TvSeasonPage from "@/features/tv/pages/TvSeasonPage";
import { useTvSeason } from "@/features/tv/hooks/useTvSeason";

vi.mock("@/features/tv/hooks/useTvSeason", () => ({ useTvSeason: vi.fn() }));
let state;
beforeEach(() => {
  state = { data: undefined, isPending: false, isError: false,
    isInvalidParams: false, isFetching: false, refetch: vi.fn() };
  vi.mocked(useTvSeason).mockImplementation(() => state);
});
function setup(url = "/tv/42/seasons/1") {
  return render(<MemoryRouter initialEntries={[url]}><Link to="/tv/42/seasons/2">Next season</Link><Link to="/tv/99/seasons/1">Other series</Link><Routes>
    <Route path="/tv/:id/seasons/:seasonNumber" element={<TvSeasonPage />} />
    <Route path="/tv/42" element={<h1>Series destination</h1>} />
  </Routes></MemoryRouter>);
}
describe("TvSeasonPage", () => {
  it("shows a skeleton during the first request", () => {
    state.isPending = true;
    setup();
    expect(screen.queryByRole("status", { name: "Loading season" })).not.toBeNull();
  });
  it("shows a not-found state for invalid parameters", () => {
    state.isPending = true;
    state.isInvalidParams = true;
    setup();
    expect(screen.queryByRole("heading", { name: "Season not found" })).not.toBeNull();
  });
  it("offers retry after an initial failure", () => {
    state.isError = true;
    setup();
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(state.refetch).toHaveBeenCalledWith({ cancelRefetch: false });
  });
  it("sorts episodes and handles missing episode information", () => {
    state.data = { name: "Season 1", episodes: [
      { id: 2, episode_number: 2, name: "Second" },
      { id: 1, episode_number: 1, name: "First" },
    ] };
    setup();
    expect(screen.getAllByRole("heading", { level: 3 }).map((node) => node.textContent))
      .toEqual(["First", "Second"]);
    expect(screen.getAllByText("Runtime unavailable")).toHaveLength(2);
    expect(screen.getAllByText("Not rated")).toHaveLength(2);
    expect(screen.getAllByText("Image unavailable")).toHaveLength(2);
  });
  it("supports an empty Specials season and returns to the series", () => {
    state.data = { episodes: [] };
    setup("/tv/42/seasons/0");
    expect(screen.queryByRole("heading", { name: "Specials" })).not.toBeNull();
    expect(screen.queryByText("No episodes are available for this season yet.")).not.toBeNull();
    fireEvent.click(screen.getByRole("link", { name: /Back to series/ }));
    expect(screen.queryByRole("heading", { name: "Series destination" })).not.toBeNull();
  });
  it("preserves episodes after a background refresh failure", () => {
    state.data = { name: "Season 1", episodes: [{ id: 1, episode_number: 1, name: "First" }] };
    state.isError = true;
    setup();
    expect(screen.queryByRole("heading", { name: "First" })).not.toBeNull();
    expect(screen.getByRole("alert").textContent).toContain("Showing available episodes");
  });
  it("does not offer retry for a 404 response", () => {
    state.isError = true;
    state.error = { response: { status: 404 } };
    setup();
    expect(screen.queryByRole("heading", { name: "Season not found" })).not.toBeNull();
    expect(screen.queryByRole("button", { name: "Retry" })).toBeNull();
  });
});

describe("Season episode pagination", () => {
  const makeEpisodes = (count) => Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    episode_number: index + 1,
    name: "Episode " + (index + 1),
  }));

  it("shows ten initially, then ten more, and handles the last partial batch", () => {
    state.data = { episodes: makeEpisodes(23).reverse() };
    setup();
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(10);
    expect(screen.queryByRole("heading", { name: "Episode 11" })).toBeNull();
    const button = screen.getByRole("button", { name: "Load more episodes" });
    fireEvent.click(button);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(20);
    fireEvent.click(button);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(23);
    expect(screen.getByRole("status").textContent).toContain("Showing 23 of 23");
    expect(button.getAttribute("aria-disabled")).toBe("true");
    fireEvent.click(button);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(23);
  });

  it.each([1, 10])("does not offer load more for %s episodes", (count) => {
    state.data = { episodes: makeEpisodes(count) };
    setup();
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(count);
    expect(screen.queryByRole("button", { name: "Load more episodes" })).toBeNull();
  });

  it.each(["Next season", "Other series"])("resets the visible count after navigating to %s", (linkName) => {
    state.data = { episodes: makeEpisodes(23) };
    setup();
    fireEvent.click(screen.getByRole("button", { name: "Load more episodes" }));
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(20);
    fireEvent.click(screen.getByRole("link", { name: linkName }));
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(10);
  });
});
