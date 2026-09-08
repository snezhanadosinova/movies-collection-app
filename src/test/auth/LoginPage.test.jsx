import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import toast from "react-hot-toast";

import LoginPage from "@/features/auth/pages/LoginPage";
import { loginUser } from "@/features/auth/services/authService";

vi.mock("@/features/auth/services/authService", () => ({
  loginUser: vi.fn(),
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

beforeEach(() => {
  vi.mocked(loginUser).mockReset();
  vi.mocked(toast.success).mockReset();
  vi.mocked(toast.error).mockReset();
});

function renderLogin(from) {
  return render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: "/login",
          state: from === undefined ? null : { from },
        },
      ]}
    >
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={<h1>Home destination</h1>}
        />

        <Route
          path="/favorites"
          element={<h1>Favorites destination</h1>}
        />
      </Routes>
    </MemoryRouter>,
  );
}

function submitValidCredentials() {
  fireEvent.change(screen.getByPlaceholderText("Email"), {
    target: { value: "alice@example.com" },
  });

  fireEvent.change(screen.getByPlaceholderText("Password"), {
    target: { value: "test-password" },
  });

  fireEvent.click(screen.getByRole("button", { name: "Login" }));
}

describe("LoginPage", () => {
  it("returns the user to the requested page after login", async () => {
    vi.mocked(loginUser).mockResolvedValue({
      uid: "test-user",
    });

    renderLogin("/favorites");
    submitValidCredentials();

    expect(
      await screen.findByRole("heading", {
        name: "Favorites destination",
      }),
    ).not.toBeNull();

    expect(loginUser).toHaveBeenCalledWith(
      "alice@example.com",
      "test-password",
    );

    expect(toast.success).toHaveBeenCalledWith(
      "Logged in successfully",
    );
  });

  it("navigates home when no return path is provided", async () => {
    vi.mocked(loginUser).mockResolvedValue({
      uid: "test-user",
    });

    renderLogin();
    submitValidCredentials();

    expect(
      await screen.findByRole("heading", {
        name: "Home destination",
      }),
    ).not.toBeNull();
  });

  it.each([
    "https://example.com",
    "//example.com",
  ])("falls back to home for an external return path: %s", async (from) => {
    vi.mocked(loginUser).mockResolvedValue({
      uid: "test-user",
    });

    renderLogin(from);
    submitValidCredentials();

    expect(
      await screen.findByRole("heading", {
        name: "Home destination",
      }),
    ).not.toBeNull();
  });

  it("stays on the login page when authentication fails", async () => {
    vi.mocked(loginUser).mockRejectedValue(
      new Error("Invalid credentials"),
    );

    renderLogin("/favorites");
    submitValidCredentials();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Invalid credentials",
      );
    });

    expect(
      screen.getByRole("heading", { name: "Login" }),
    ).not.toBeNull();

    expect(
      screen.queryByRole("heading", {
        name: "Favorites destination",
      }),
    ).toBeNull();

    expect(toast.success).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Login" }).disabled,
      ).toBe(false);
    });
  });

  it("rejects a short password without calling the auth service", async () => {
    renderLogin();

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "alice@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(
      await screen.findByText(
        "Password must be at least 6 characters",
      ),
    ).not.toBeNull();

    expect(loginUser).not.toHaveBeenCalled();
  });
});