import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Footer from "@/components/layout/Footer";

describe("Footer", () => {
  it("provides a footer landmark and named navigation to public catalogs", () => {
    render(<MemoryRouter><Footer /></MemoryRouter>);
    const footer = screen.getByRole("contentinfo");
    const navigation = within(footer).getByRole("navigation", { name: "Footer navigation" });
    for (const [name, path] of [["Home", "/"], ["Movies", "/movies"], ["TV Series", "/tv"]]) {
      expect(within(navigation).getByRole("link", { name }).getAttribute("href")).toBe(path);
    }
    const link = within(navigation).getByRole("link", { name: "Movies" });
    link.focus();
    expect(document.activeElement).toBe(link);
  });

  it("attributes TMDB and links to the data provider", () => {
    render(<MemoryRouter><Footer /></MemoryRouter>);
    expect(screen.getByText(/not endorsed or certified by TMDB/)).not.toBeNull();
    expect(screen.getByRole("link", { name: "Visit TMDB" }).getAttribute("href"))
      .toBe("https://www.themoviedb.org/");
  });
});
