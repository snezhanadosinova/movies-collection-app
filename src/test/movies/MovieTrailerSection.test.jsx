import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MovieTrailerSection } from "@/features/movies/components/MovieTrailerSection";

describe("MovieTrailerSection", () => {
  it("loads the player only after the user clicks play", () => {
    const trailer = {
      key: "abcdefghijk",
      name: "Example movie trailer",
    };

    render(<MovieTrailerSection trailer={trailer} />);

    expect(
      screen.queryByTitle("Example movie trailer"),
    ).toBeNull();

    fireEvent.click(
      screen.getByRole("button", { name: /Play trailer/i }),
    );

    const iframe = screen.getByTitle("Example movie trailer");

    expect(iframe.getAttribute("src")).toBe(
      "https://www.youtube-nocookie.com/embed/abcdefghijk?autoplay=1",
    );

    expect(
      screen.queryByRole("button", { name: /Play trailer/i }),
    ).toBeNull();
  });

  it("renders nothing when a trailer is unavailable", () => {
    const { container } = render(
      <MovieTrailerSection trailer={null} />,
    );

    expect(container.childElementCount).toBe(0);
  });
});