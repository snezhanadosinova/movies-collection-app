import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import GenreFilter from "@/components/movie/GenreFilter";
import { useMovieGenres } from "@/features/movies/hooks/useMovieGenres";

vi.mock("@/features/movies/hooks/useMovieGenres", () => ({
  useMovieGenres: vi.fn(),
}));

let queryState;

beforeEach(() => {
  queryState = {
    data: [
      { id: 27, name: "Horror" },
      { id: 28, name: "Action" },
    ],
    isPending: false,
    isError: false,
    isFetching: false,
    refetch: vi.fn(),
  };

  vi.mocked(useMovieGenres).mockImplementation(() => queryState);
});

describe("GenreFilter", () => {
  it("has an accessible label and displays the selected genre", () => {
    render(<GenreFilter value="27" onChange={vi.fn()} />);

    const select = screen.getByRole("combobox", { name: "Genre" });

    expect(screen.getByLabelText("Genre")).toBe(select);
    expect(select.value).toBe("27");
    expect(select.selectedOptions[0].textContent).toBe("Horror");
  });

  it("passes the selected genre ID to onChange", () => {
    const onChange = vi.fn();

    render(<GenreFilter value="" onChange={onChange} />);

    fireEvent.change(screen.getByRole("combobox", { name: "Genre" }), {
      target: { value: "28" },
    });

    expect(onChange).toHaveBeenCalledWith("28");
  });

  it("preserves the selected value while genres load", () => {
    queryState = {
      ...queryState,
      data: undefined,
      isPending: true,
      isFetching: true,
    };

    render(<GenreFilter value="27" onChange={vi.fn()} />);

    const select = screen.getByRole("combobox", { name: "Genre" });

    expect(select.value).toBe("27");
    expect(select.selectedOptions[0].textContent).toBe("Selected genre");
    expect(select.getAttribute("aria-busy")).toBe("true");
    expect(screen.getByRole("status").textContent).toBe(
      "Loading genres...",
    );
  });

  it("allows clearing the genre when loading fails", () => {
    queryState = {
      ...queryState,
      data: undefined,
      isError: true,
    };

    const onChange = vi.fn();

    render(<GenreFilter value="27" onChange={onChange} />);

    fireEvent.change(screen.getByRole("combobox", { name: "Genre" }), {
      target: { value: "" },
    });

    expect(onChange).toHaveBeenCalledWith("");
    expect(screen.getByRole("status").textContent).toBe(
      "Could not load genres.",
    );
  });

  it("retries a failed request", () => {
    queryState.isError = true;

    render(<GenreFilter value="" onChange={vi.fn()} />);

    fireEvent.click(
      screen.getByRole("button", { name: "Retry loading genres" }),
    );

    expect(queryState.refetch).toHaveBeenCalledWith({
      cancelRefetch: false,
    });
  });

  it("disables retry while a request is running", () => {
    queryState.isError = true;
    queryState.isFetching = true;

    render(<GenreFilter value="" onChange={vi.fn()} />);

    const button = screen.getByRole("button", {
      name: "Retry loading genres",
    });

    expect(button.disabled).toBe(true);

    fireEvent.click(button);

    expect(queryState.refetch).not.toHaveBeenCalled();
  });

  it("preserves available genres when refreshing fails", () => {
    queryState.isError = true;

    render(<GenreFilter value="27" onChange={vi.fn()} />);

    const select = screen.getByRole("combobox", { name: "Genre" });

    expect(select.disabled).toBe(false);
    expect(select.selectedOptions[0].textContent).toBe("Horror");
    expect(screen.getByRole("status").textContent).toBe(
      "Could not refresh genres.",
    );
  });
});