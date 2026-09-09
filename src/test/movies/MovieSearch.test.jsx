import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import MovieSearch from "@/components/movie/MovieSearch";

describe("MovieSearch", () => {
  it("has an accessible label and displays the current value", () => {
    render(<MovieSearch value="Alien" onChange={vi.fn()} />);

    const input = screen.getByRole("searchbox", {
      name: "Search movies",
    });

    expect(input.value).toBe("Alien");
    expect(screen.getByLabelText("Search movies")).toBe(input);
  });

  it("passes the entered text to onChange", () => {
    const onChange = vi.fn();

    render(<MovieSearch value="" onChange={onChange} />);

    fireEvent.change(
      screen.getByRole("searchbox", { name: "Search movies" }),
      {
        target: { value: "Batman" },
      },
    );

    expect(onChange).toHaveBeenCalledWith("Batman");
  });
});