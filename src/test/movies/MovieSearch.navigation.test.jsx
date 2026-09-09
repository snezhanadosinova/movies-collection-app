import { fireEvent, render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import MovieSearch from "@/components/movie/MovieSearch";
import { useMovieFilter } from "@/features/movies/hooks/useMovieFilter";

vi.mock("@/features/movies/hooks/useMovieGenres", () => ({
  useMovieGenres: () => ({
    data: [{ id: 27, name: "Horror" }],
  }),
}));

vi.mock("@/features/movies/hooks/useSearchMovies", () => ({
  MIN_SEARCH_LENGTH: 2,
  useSearchMovies: () => ({
    data: [],
    isLoading: false,
    isError: false,
  }),
}));

vi.mock("@/features/movies/hooks/useInfinitePopularMovies", () => ({
  useInfinitePopularMovies: () => ({
    data: { pages: [{ results: [] }] },
    isLoading: false,
    isError: false,
  }),
}));

vi.mock("@/features/movies/hooks/useInfiniteDiscoverMovies", () => ({
  useInfiniteDiscoverMovies: () => ({
    data: { pages: [{ results: [] }] },
    isLoading: false,
    isError: false,
  }),
}));

function SearchHarness() {
  const { search, setSearch } = useMovieFilter();

  return <MovieSearch value={search} onChange={setSearch} />;
}

describe("MovieSearch navigation", () => {
  it("updates the controlled value synchronously while typing and clearing", () => {
    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: <SearchHarness />,
        },
      ],
      {
        initialEntries: ["/?genre=27"],
      },
    );

    const { unmount } = render(<RouterProvider router={router} />);

    try {
      const input = screen.getByRole("searchbox", {
        name: "Search movies",
      });

      const values = [
        "p",
        "pu",
        "pus",
        "puss",
        "puss ",
        "puss i",
        "puss in",
        "puss in ",
        "puss in b",
        "puss in bo",
        "puss in boo",
        "puss in boot",
        "puss in boots",
        "puss in boot",
        "puss in boo",
        "",
        "A",
        "Al",
      ];

      for (const value of values) {
        let valueDuringChange;

        // Observe the DOM before the change event finishes.
        const captureValue = () => {
          valueDuringChange = input.value;
        };

        document.addEventListener("change", captureValue);

        try {
          fireEvent.change(input, {
            target: { value },
          });
        } finally {
          document.removeEventListener("change", captureValue);
        }

        expect(valueDuringChange).toBe(value);
        expect(input.value).toBe(value);

        const params = new URLSearchParams(router.state.location.search);

        expect(params.get("q")).toBe(value === "" ? null : value);
        expect(params.get("genre")).toBe("27");
      }
    } finally {
      unmount();
      router.dispose();
    }
  });
});
