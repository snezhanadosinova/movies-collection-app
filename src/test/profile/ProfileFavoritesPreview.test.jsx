import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { ProfileFavoritesPreview } from "@/features/profile/components/ProfileFavoritesPreview";

function preview(props) {
  return <MemoryRouter><ProfileFavoritesPreview {...props} /></MemoryRouter>;
}
describe("profile favorites loading", () => {
  it("keeps the total and ordered slots while details arrive", () => {
    const slots = Array.from({ length: 8 }, (_, i) => ({ id: i + 1, media_type: "movie", isPending: true }));
    const { rerender } = render(preview({ slots, loading: true }));
    expect(screen.getByRole("heading", { name: "Favorites (8)" })).not.toBeNull();
    const positions = screen.getAllByRole("listitem");
    expect(positions).toHaveLength(6);
    const updated = slots.map((slot, index) => index === 2
      ? { ...slot, isPending: false, item: { id: 3, title: "Third movie" } } : slot);
    rerender(preview({ slots: updated }));
    expect(screen.getAllByRole("listitem")[2]).toBe(positions[2]);
    expect(positions[2].contains(screen.getByRole("link", { name: "Third movie" }))).toBe(true);
    expect(screen.getByRole("heading", { name: "Favorites (8)" })).not.toBeNull();
  });
  it("preserves loaded titles after an error and offers retry", () => {
    const retry = vi.fn();
    render(preview({ isError: true, onRetry: retry, slots: [
      { id: 42, media_type: "tv", item: { id: 42, name: "Series" } },
      { id: 43, media_type: "movie", isError: true },
    ] }));
    expect(screen.getByRole("link", { name: "Series" }).getAttribute("href")).toBe("/tv/42");
    expect(screen.getByRole("alert")).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Retry favorites" }));
    expect(retry).toHaveBeenCalledTimes(1);
  });
  it("does not show an empty collection during initial loading", () => {
    render(preview({ slots: [], loading: true }));
    expect(screen.getAllByRole("listitem")).toHaveLength(6);
    expect(screen.queryByText(/No favorites yet/)).toBeNull();
    expect(screen.getByRole("status").textContent).toBe("Loading favorites...");
  });
});
