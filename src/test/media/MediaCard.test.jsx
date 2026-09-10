import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import MediaCard from "@/components/media/MediaCard";

describe("MediaCard", () => {
  it("navigates to the supplied TV destination", () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={
            <MediaCard title="Example series" to="/tv/42" voteAverage={8.25} />
          } />
          <Route path="/tv/42" element={<h1>Series details</h1>} />
        </Routes>
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole("link", { name: /Example series/ }));
    expect(screen.queryByRole("heading", { name: "Series details" })).not.toBeNull();
  });

  it("keeps optional actions outside the navigation link", () => {
    const onClick = vi.fn();
    render(
      <MemoryRouter>
        <MediaCard
          title="Example"
          to="/movies/42"
          action={<button onClick={onClick}>Save title</button>}
        />
      </MemoryRouter>,
    );
    const button = screen.getByRole("button", { name: "Save title" });
    expect(button.closest("a")).toBeNull();
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders fallbacks without requiring an action", () => {
    render(
      <MemoryRouter>
        <MediaCard title="Example" to="/tv/42" voteAverage={NaN} />
      </MemoryRouter>,
    );
    expect(screen.queryByText("Poster unavailable")).not.toBeNull();
    expect(screen.queryByText("Not rated")).not.toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("preserves a zero rating", () => {
    render(
      <MemoryRouter>
        <MediaCard title="Example" to="/tv/42" voteAverage={0} />
      </MemoryRouter>,
    );
    expect(screen.queryByText("0.0")).not.toBeNull();
    expect(screen.queryByText("Not rated")).toBeNull();
  });
});
