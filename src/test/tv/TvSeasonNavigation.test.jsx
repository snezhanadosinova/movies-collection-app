import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import TvDetailsPage from "@/features/tv/pages/TvDetailsPage";

vi.mock("@/features/tv/hooks/useTvDetails", () => ({
  useTvDetails: () => ({
    data: {
      id: 42,
      name: "Example series",
      seasons: [{ season_number: 0, name: "Specials", episode_count: 2 }],
    },
    isPending: false,
    isError: false,
    isInvalidId: false,
  }),
}));

describe("TV season navigation", () => {
  it("opens Specials from the series season card", () => {
    render(
      <MemoryRouter initialEntries={["/tv/42"]}>
        <Routes>
          <Route path="/tv/:id" element={<TvDetailsPage />} />
          <Route path="/tv/42/seasons/0" element={<h1>Specials destination</h1>} />
        </Routes>
      </MemoryRouter>,
    );
    const link = screen.getByRole("link", { name: /Specials/ });
    expect(link.getAttribute("href")).toBe("/tv/42/seasons/0");
    fireEvent.click(link);
    expect(screen.queryByRole("heading", { name: "Specials destination" })).not.toBeNull();
  });
});
