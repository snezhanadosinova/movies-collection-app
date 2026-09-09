import { fireEvent, render, screen } from "@testing-library/react";
import { useIsMutating } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import FavoriteButton from "@/components/movie/FavoriteButton";
import { useAuth } from "@/features/auth/context/useAuth";
import { useFavorites } from "@/features/favorites/hooks/useFavorites";
import { useToggleFavorite } from "@/features/favorites/hooks/useToggleFavorite";

vi.mock("@tanstack/react-query", () => ({
  useIsMutating: vi.fn(),
}));

vi.mock("@/features/auth/context/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/features/favorites/hooks/useFavorites", () => ({
  useFavorites: vi.fn(),
}));

vi.mock("@/features/favorites/hooks/useToggleFavorite", () => ({
  useToggleFavorite: vi.fn(),
}));

let mutate;
let refetch;

beforeEach(() => {
  mutate = vi.fn();
  refetch = vi.fn().mockResolvedValue(undefined);

  vi.mocked(useAuth).mockReturnValue({
    user: { uid: "test-user" },
    loading: false,
  });

  vi.mocked(useFavorites).mockReturnValue({
    data: {},
    isPending: false,
    isError: false,
    isFetching: false,
    refetch,
  });

  vi.mocked(useToggleFavorite).mockReturnValue({
    mutate,
    isPending: false,
  });

  vi.mocked(useIsMutating).mockReturnValue(0);
});

function LoginDestination() {
  const location = useLocation();

  return (
    <div>
      <h1>Login destination</h1>
      <p data-testid="return-path">{location.state?.from}</p>
    </div>
  );
}

function renderButton() {
  return render(
    <MemoryRouter initialEntries={["/movies/550"]}>
      <Routes>
        <Route path="/movies/:id" element={<FavoriteButton movieId={550} />} />

        <Route path="/login" element={<LoginDestination />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("FavoriteButton", () => {
  it("adds a movie that is not already a favorite", () => {
    renderButton();

    const button = screen.getByRole("button", {
      name: "Add to favorites",
    });

    expect(button.getAttribute("aria-pressed")).toBe("false");

    fireEvent.click(button);

    expect(mutate).toHaveBeenCalledWith(
      { movieId: 550, isFavorite: false },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      }),
    );
  });

  it("removes an existing favorite", () => {
    vi.mocked(useFavorites).mockReturnValue({
      data: { 550: true },
      isPending: false,
      isError: false,
      isFetching: false,
      refetch,
    });

    renderButton();

    const button = screen.getByRole("button", {
      name: "Remove from favorites",
    });

    expect(button.getAttribute("aria-pressed")).toBe("true");

    fireEvent.click(button);

    expect(mutate).toHaveBeenCalledWith(
      { movieId: 550, isFavorite: true },
      expect.any(Object),
    );
  });

  it("redirects a guest to login and preserves the movie URL", async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
    });

    renderButton();

    fireEvent.click(screen.getByRole("button", { name: "Add to favorites" }));

    expect(
      await screen.findByRole("heading", {
        name: "Login destination",
      }),
    ).not.toBeNull();

    expect(screen.getByTestId("return-path").textContent).toBe("/movies/550");

    expect(mutate).not.toHaveBeenCalled();
  });

  it("prevents changes before favorites have loaded", () => {
    vi.mocked(useFavorites).mockReturnValue({
      data: undefined,
      isPending: true,
      isError: false,
      isFetching: true,
      refetch,
    });

    renderButton();

    const button = screen.getByRole("button", {
      name: "Checking favorites...",
    });

    expect(button.disabled).toBe(true);

    fireEvent.click(button);

    expect(mutate).not.toHaveBeenCalled();
  });

  it("retries loading favorites instead of guessing their state", () => {
    vi.mocked(useFavorites).mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
      isFetching: false,
      refetch,
    });

    renderButton();

    fireEvent.click(screen.getByRole("button", { name: "Retry favorites" }));

    expect(refetch).toHaveBeenCalledTimes(1);
    expect(mutate).not.toHaveBeenCalled();
  });

  it("disables the button when another mutation for the movie is pending", () => {
    vi.mocked(useIsMutating).mockReturnValue(1);

    renderButton();

    const button = screen.getByRole("button", {
      name: "Saving...",
    });

    expect(button.disabled).toBe(true);

    fireEvent.click(button);

    expect(mutate).not.toHaveBeenCalled();
  });
});
