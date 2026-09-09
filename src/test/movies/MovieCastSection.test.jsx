import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MovieCastSection } from "@/features/movies/components/MovieCastSection";

function createCast(count) {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `Actor ${index + 1}`,
    character: `Character ${index + 1}`,
    profile_path: null,
  }));
}

describe("MovieCastSection", () => {
  it("shows six actors and navigates between pages", () => {
    render(<MovieCastSection cast={createCast(8)} />);

    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(6);

    expect(
      screen.getByRole("button", { name: "Previous cast page" }).disabled,
    ).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: "Next cast page" }));

    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(2);
    expect(screen.getByText("Actor 7")).not.toBeNull();
    expect(screen.getByText("Actor 8")).not.toBeNull();
    expect(screen.queryByText("Actor 1")).toBeNull();

    expect(
      screen.getByRole("button", { name: "Next cast page" }).disabled,
    ).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: "Previous cast page" }));

    expect(screen.getByText("Actor 1")).not.toBeNull();
    expect(screen.queryByText("Actor 7")).toBeNull();
  });

  it("does not show navigation for a single page", () => {
    render(<MovieCastSection cast={createCast(6)} />);

    expect(screen.queryByRole("button", { name: "Next cast page" })).toBeNull();

    expect(
      screen.queryByRole("button", { name: "Previous cast page" }),
    ).toBeNull();
  });

  it("does not display duplicate actors", () => {
    const cast = createCast(2);

    render(<MovieCastSection cast={[...cast, cast[0]]} />);

    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(2);
  });

  it("shows an empty state when cast information is unavailable", () => {
    render(<MovieCastSection cast={[]} />);

    expect(screen.getByText("Cast information is unavailable.")).not.toBeNull();

    expect(screen.queryByRole("list")).toBeNull();
  });
});
