import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ProtectedRoute from "@/routes/ProtectedRoute";
import { useAuth } from "@/features/auth/context/useAuth";

vi.mock("@/features/auth/context/useAuth", () => ({
  useAuth: vi.fn(),
}));

function LoginDestination() {
  const location = useLocation();

  return (
    <div>
      <h1>Login destination</h1>
      <p data-testid="return-path">{location.state?.from}</p>
    </div>
  );
}

function TestRoutes() {
  return (
    <Routes>
      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <h1>Favorites page</h1>
          </ProtectedRoute>
        }
      />

      <Route path="/login" element={<LoginDestination />} />
    </Routes>
  );
}

function TestApp() {
  return (
    <MemoryRouter initialEntries={["/favorites?sort=title#saved"]}>
      <TestRoutes />
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.mocked(useAuth).mockReset();
});

describe("ProtectedRoute", () => {
  it("renders the page for an authenticated user", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { uid: "test-user" },
      loading: false,
    });

    render(<TestApp />);

    expect(
      screen.getByRole("heading", { name: "Favorites page" }),
    ).not.toBeNull();

    expect(
      screen.queryByRole("heading", { name: "Login destination" }),
    ).toBeNull();
  });

  it("redirects a guest and preserves the requested URL", async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
    });

    render(<TestApp />);

    expect(
      await screen.findByRole("heading", {
        name: "Login destination",
      }),
    ).not.toBeNull();

    expect(screen.getByTestId("return-path").textContent).toBe(
      "/favorites?sort=title#saved",
    );

    expect(
      screen.queryByRole("heading", { name: "Favorites page" }),
    ).toBeNull();
  });

  it("waits for session restoration before redirecting a guest", async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: true,
    });

    const { rerender } = render(<TestApp />);

    expect(
      screen.queryByRole("heading", { name: "Login destination" }),
    ).toBeNull();

    // Complete session restoration without an authenticated user.
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
    });

    rerender(<TestApp />);

    expect(
      await screen.findByRole("heading", {
        name: "Login destination",
      }),
    ).not.toBeNull();
  });

  it("redirects when the authenticated user logs out", async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { uid: "test-user" },
      loading: false,
    });

    const { rerender } = render(<TestApp />);

    expect(
      screen.getByRole("heading", { name: "Favorites page" }),
    ).not.toBeNull();

    // Simulate the auth provider receiving a logout event.
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
    });

    rerender(<TestApp />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Login destination" }),
      ).not.toBeNull();

      expect(
        screen.queryByRole("heading", { name: "Favorites page" }),
      ).toBeNull();
    });
  });
});
