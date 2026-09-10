import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import RecommendationsSection from "@/components/media/RecommendationsSection";

const items = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  name: `Series ${index + 1}`,
  first_air_date: "2020-01-01",
}));

describe("RecommendationsSection", () => {
  it("shows only the first six recommendations without navigation", () => {
    render(<RecommendationsSection items={items} mediaType="tv" />, {
      wrapper: MemoryRouter,
    });
    expect(screen.getAllByRole("link")).toHaveLength(6);
    expect(screen.queryByRole("link", { name: /Series 7/ })).toBeNull();
    expect(screen.getByRole("link", { name: /Series 1/ }).getAttribute("href")).toBe("/tv/1");
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("shows all available titles when fewer than six are returned", () => {
    render(<RecommendationsSection items={items.slice(0, 2)} mediaType="tv" />, {
      wrapper: MemoryRouter,
    });
    expect(screen.getAllByRole("link")).toHaveLength(2);
  });

  it("uses movie titles, release dates and local movie links", () => {
    render(<RecommendationsSection items={[{ id: 9, title: "Movie", release_date: "1999-01-01" }]} />, {
      wrapper: MemoryRouter,
    });
    expect(screen.getByRole("link", { name: /Movie/ }).getAttribute("href")).toBe("/movies/9");
    expect(screen.queryByText("1999")).not.toBeNull();
  });

  it("shows a useful empty state", () => {
    render(<RecommendationsSection />, { wrapper: MemoryRouter });
    expect(screen.queryByText("No suggestions are available yet.")).not.toBeNull();
  });
});
