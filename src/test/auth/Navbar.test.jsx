import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/features/auth/context/useAuth";
import { readCachedAvatar } from "@/utils/avatarCache";

vi.mock("@/features/auth/context/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/utils/avatarCache", () => ({
  readCachedAvatar: vi.fn(),
}));

vi.mock("@/features/auth/services/authService", () => ({
  logoutUser: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(useAuth).mockReset();
  vi.mocked(readCachedAvatar).mockReset();
});

function renderNavbar() {
  return render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>,
  );
}

describe("Navbar session restoration", () => {
  it("shows a disabled cached avatar while restoring the session", () => {
    vi.mocked(readCachedAvatar).mockReturnValue("AS");

    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: true,
    });

    renderNavbar();

    const avatarButton = screen.getByRole("button", {
      name: "Open account menu",
    });

    expect(avatarButton.textContent).toBe("AS");
    expect(avatarButton.disabled).toBe(true);

    expect(screen.getByRole("link", { name: "Movies" })).not.toBeNull();

    expect(screen.queryByRole("link", { name: "Login" })).toBeNull();

    expect(screen.queryByRole("link", { name: "Register" })).toBeNull();

    fireEvent.click(avatarButton);

    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("activates the same avatar button after session restoration", () => {
    vi.mocked(readCachedAvatar).mockReturnValue("AS");

    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: true,
    });

    const { rerender } = renderNavbar();

    const initialButton = screen.getByRole("button", {
      name: "Open account menu",
    });

    vi.mocked(useAuth).mockReturnValue({
      user: {
        uid: "test-user",
        displayName: "Alice Smith",
        email: "alice@example.com",
      },
      loading: false,
    });

    rerender(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    const activeButton = screen.getByRole("button", {
      name: "Open account menu",
    });

    // Preserve the DOM element across session restoration.
    expect(activeButton).toBe(initialButton);
    expect(activeButton.disabled).toBe(false);
    expect(activeButton.textContent).toBe("AS");

    expect(screen.queryByRole("link", { name: "Login" })).toBeNull();
  });

  it("replaces a stale cached avatar with guest links", () => {
    vi.mocked(readCachedAvatar).mockReturnValue("AS");

    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: true,
    });

    const { rerender } = renderNavbar();

    expect(
      screen.getByRole("button", { name: "Open account menu" }),
    ).not.toBeNull();

    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
    });

    rerender(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    expect(
      screen.queryByRole("button", { name: "Open account menu" }),
    ).toBeNull();

    expect(screen.getByRole("link", { name: "Login" })).not.toBeNull();

    expect(screen.getByRole("link", { name: "Register" })).not.toBeNull();
  });

  it("keeps public navigation visible without cached session information", () => {
    vi.mocked(readCachedAvatar).mockReturnValue("");

    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: true,
    });

    renderNavbar();

    expect(screen.getByRole("link", { name: "Movies" })).not.toBeNull();

    expect(
      screen.queryByRole("button", { name: "Open account menu" }),
    ).toBeNull();

    expect(screen.queryByRole("link", { name: "Login" })).toBeNull();

    expect(screen.queryByRole("link", { name: "Register" })).toBeNull();
  });
});
