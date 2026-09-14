import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import MediaCard from "@/components/media/MediaCard";
import MovieGridSkeleton from "@/components/movie/MovieGridSkeleton";

describe("catalog loading presentation", () => {
  it("loads a priority poster eagerly while leaving other posters lazy", () => {
    const { container } = render(<MemoryRouter>
      <MediaCard title="First" to="/tv/1" posterPath="/first.jpg" eager priority />
      <MediaCard title="Later" to="/tv/2" posterPath="/later.jpg" />
    </MemoryRouter>);
    const [first, later] = container.querySelectorAll("img");
    expect(first.getAttribute("loading")).toBe("eager");
    expect(first.getAttribute("fetchpriority")).toBe("high");
    expect(later.getAttribute("loading")).toBe("lazy");
    expect(first.getAttribute("srcset")).toContain("/w342/first.jpg 342w");
    expect(first.getAttribute("srcset")).toContain("/w780/first.jpg 780w");
    expect(first.getAttribute("sizes")).toContain("286px");
    expect(first.getAttribute("width")).toBe("500");
    expect(first.getAttribute("height")).toBe("750");
  });
  it("announces the correct media type with one status region", () => {
    render(<MovieGridSkeleton label="Loading TV series" count={4} />);
    expect(screen.getAllByRole("status")).toHaveLength(1);
    expect(screen.getByRole("status", { name: "Loading TV series" })).not.toBeNull();
  });
});
