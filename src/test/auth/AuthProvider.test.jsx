import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { onAuthStateChanged } from "firebase/auth";

import { AuthProvider } from "@/features/auth/context/AuthProvider";
import { useAuth } from "@/features/auth/context/useAuth";
import { auth } from "@/lib/firebase";
import { saveCachedAvatar } from "@/utils/avatarCache";

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: vi.fn(),
}));

vi.mock("@/lib/firebase", () => ({
  auth: {
    currentUser: null,
  },
}));

vi.mock("@/utils/avatarCache", () => ({
  saveCachedAvatar: vi.fn(),
}));

let notifyAuthChange;
let unsubscribe;

beforeEach(() => {
  auth.currentUser = null;
  unsubscribe = vi.fn();

  vi.mocked(saveCachedAvatar).mockReset();
  vi.mocked(onAuthStateChanged).mockReset();

  vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
    notifyAuthChange = callback;
    return unsubscribe;
  });
});

function emitAuthChange(user) {
  auth.currentUser = user;
  notifyAuthChange(user);
}

describe("AuthProvider", () => {
  it("restores the user, caches the avatar and unsubscribes on unmount", () => {
    const user = {
      uid: "test-user",
      displayName: "Alice Smith",
      email: "alice@example.com",
    };

    const { result, unmount } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBeNull();

    act(() => {
      emitAuthChange(user);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.user).toBe(user);
    expect(saveCachedAvatar).toHaveBeenLastCalledWith("AS");

    unmount();

    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });

  it("clears the user and cached avatar after logout", () => {
    const user = {
      uid: "test-user",
      displayName: "Alice Smith",
      email: "alice@example.com",
    };

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      emitAuthChange(user);
    });

    act(() => {
      emitAuthChange(null);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(saveCachedAvatar).toHaveBeenLastCalledWith("");
  });

  it("updates the user and cached avatar after a profile refresh", async () => {
    const user = {
      uid: "test-user",
      displayName: "Alice Smith",
      email: "alice@example.com",
      reload: vi.fn(),
    };

    user.reload.mockImplementation(async () => {
      user.displayName = "Alice Jones";
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      emitAuthChange(user);
    });

    const previousUser = result.current.user;

    await act(async () => {
      await result.current.refreshUser();
    });

    expect(user.reload).toHaveBeenCalledTimes(1);
    expect(result.current.user.displayName).toBe("Alice Jones");
    expect(result.current.user).not.toBe(previousUser);
    expect(saveCachedAvatar).toHaveBeenLastCalledWith("AJ");
  });

  it("does not restore a user when refresh completes after logout", async () => {
    let resolveReload;

    const pendingReload = new Promise((resolve) => {
      resolveReload = resolve;
    });

    const user = {
      uid: "test-user",
      displayName: "Alice Smith",
      email: "alice@example.com",
      reload: vi.fn().mockReturnValue(pendingReload),
    };

    const { result, unmount } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    let refreshPromise;

    try {
      act(() => {
        emitAuthChange(user);
      });

      act(() => {
        refreshPromise = result.current.refreshUser();
      });

      // Log out while the profile refresh is still pending.
      act(() => {
        emitAuthChange(null);
      });

      await act(async () => {
        resolveReload();
        await refreshPromise;
      });

      expect(result.current.user).toBeNull();
      expect(saveCachedAvatar).toHaveBeenLastCalledWith("");
    } finally {
      resolveReload();
      await refreshPromise;
      unmount();
    }
  });
});
