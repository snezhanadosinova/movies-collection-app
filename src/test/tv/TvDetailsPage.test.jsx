import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TvDetailsPage from "@/features/tv/pages/TvDetailsPage";
import { useTvDetails } from "@/features/tv/hooks/useTvDetails";

vi.mock("@/features/tv/hooks/useTvDetails", () => ({ useTvDetails: vi.fn() }));
let state;
beforeEach(() => {
  state = { data: undefined, isPending: false, isError: false,
    isInvalidId: false, isFetching: false, refetch: vi.fn() };
  vi.mocked(useTvDetails).mockImplementation(() => state);
});
function setup() {
  return render(<MemoryRouter initialEntries={["/tv/42"]}><Routes>
    <Route path="/tv/:id" element={<TvDetailsPage />} />
  </Routes></MemoryRouter>);
}
describe("TvDetailsPage", () => {
  it("renders a loading skeleton", () => {
    state.isPending = true;
    setup();
    expect(screen.queryByRole("status", { name: "Loading series" })).not.toBeNull();
  });
  it("handles invalid IDs before the pending state", () => {
    state.isInvalidId = true;
    state.isPending = true;
    setup();
    expect(screen.queryByRole("heading", { name: "Series not found" })).not.toBeNull();
  });
  it("offers retry after a request failure", () => {
    state.isError = true;
    setup();
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(state.refetch).toHaveBeenCalledWith({ cancelRefetch: false });
  });
  it("renders missing metadata without crashing", () => {
    state.data = { id: 42, name: "Example series" };
    setup();
    expect(screen.queryByRole("heading", { level: 1, name: "Example series" })).not.toBeNull();
    expect(screen.queryByText("Overview is unavailable.")).not.toBeNull();
    expect(screen.queryByText("Season information is unavailable.")).not.toBeNull();
  });
  it("links creators, cast, genres and recommendations to local pages", () => {
    state.data = {
      id: 42, name: "Example", genres: [{ id: 18, name: "Drama" }],
      created_by: [{ id: 7, name: "Creator" }],
      aggregate_credits: { cast: [{ id: 8, name: "Actor", roles: [{ character: "Alex" }] }] },
      recommendations: { results: [{ id: 43, name: "Another series" }] },
      seasons: [{ season_number: 0, name: "Specials", episode_count: 2 }],
    };
    setup();
    expect(screen.getByRole("link", { name: "Creator" }).getAttribute("href")).toBe("/people/7");
    expect(screen.getByRole("link", { name: /Actor/ }).getAttribute("href")).toBe("/people/8");
    expect(screen.getByRole("link", { name: "Drama" }).getAttribute("href")).toBe("/tv?genre=18");
    expect(screen.getByRole("link", { name: /Another series/ }).getAttribute("href")).toBe("/tv/43");
    expect(screen.queryByRole("heading", { name: "Specials" })).not.toBeNull();
  });
  it("keeps existing details during a refresh failure", () => {
    state.data = { id: 42, name: "Example" };
    state.isError = true;
    setup();
    expect(screen.queryByRole("heading", { level: 1, name: "Example" })).not.toBeNull();
    expect(screen.getByRole("alert").textContent).toContain("Showing available details");
  });
});
