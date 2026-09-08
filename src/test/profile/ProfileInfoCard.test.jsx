import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import toast from "react-hot-toast";

import { ProfileInfoCard } from "@/features/profile/components/ProfileInfoCard";
import { updateUserProfile } from "@/features/auth/services/authService";

vi.mock("@/features/auth/services/authService", () => ({
  updateUserProfile: vi.fn(),
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const user = {
  uid: "test-user",
  displayName: "Anna Maria Petrova",
  email: "anna@example.com",
};

beforeEach(() => {
  vi.mocked(updateUserProfile).mockReset();
  vi.mocked(toast.success).mockReset();
  vi.mocked(toast.error).mockReset();
});

function renderProfile(onProfileUpdate = vi.fn().mockResolvedValue()) {
  render(<ProfileInfoCard user={user} onProfileUpdate={onProfileUpdate} />);

  return { onProfileUpdate };
}

async function openEditor() {
  fireEvent.click(screen.getByRole("button", { name: "Edit display name" }));

  await screen.findByRole("dialog", {
    name: "Edit display name",
  });

  return screen.getByRole("textbox", { name: "Display name" });
}

describe("Profile name editing", () => {
  it("opens the editor with the complete display name", async () => {
    renderProfile();

    const input = await openEditor();

    expect(input.value).toBe("Anna Maria Petrova");
  });

  it("discards unsaved changes when the user cancels", async () => {
    renderProfile();

    const input = await openEditor();

    fireEvent.change(input, {
      target: { value: "Unsaved name" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });

    const reopenedInput = await openEditor();

    expect(reopenedInput.value).toBe("Anna Maria Petrova");
    expect(updateUserProfile).not.toHaveBeenCalled();
  });

  it("rejects a name containing only whitespace", async () => {
    renderProfile();

    const input = await openEditor();

    fireEvent.change(input, {
      target: { value: "   " },
    });

    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    expect(
      await screen.findByText("Display name must be at least 2 characters."),
    ).not.toBeNull();

    expect(updateUserProfile).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).not.toBeNull();
  });

  it("saves the complete normalized name and refreshes the profile", async () => {
    vi.mocked(updateUserProfile).mockResolvedValue(user);

    const { onProfileUpdate } = renderProfile();
    const input = await openEditor();

    fireEvent.change(input, {
      target: { value: "  Anna Maria Ivanova  " },
    });

    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });

    expect(updateUserProfile).toHaveBeenCalledWith({
      displayName: "Anna Maria Ivanova",
    });

    expect(onProfileUpdate).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith("Profile updated");
  });

  it("preserves the draft when saving fails", async () => {
    vi.mocked(updateUserProfile).mockRejectedValue(new Error("Save failed"));

    const { onProfileUpdate } = renderProfile();
    const input = await openEditor();

    fireEvent.change(input, {
      target: { value: "Anna Ivanova" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    expect(
      await screen.findByText("Could not save your name. Please try again."),
    ).not.toBeNull();

    expect(input.value).toBe("Anna Ivanova");
    expect(screen.getByRole("dialog")).not.toBeNull();
    expect(onProfileUpdate).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Save changes" }).disabled,
      ).toBe(false);
    });
  });

  it("distinguishes a refresh failure from a save failure", async () => {
    vi.mocked(updateUserProfile).mockResolvedValue(user);

    const onProfileUpdate = vi
      .fn()
      .mockRejectedValue(new Error("Refresh failed"));

    renderProfile(onProfileUpdate);

    const input = await openEditor();

    fireEvent.change(input, {
      target: { value: "Anna Ivanova" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    expect(
      await screen.findByText(
        "Your name was saved, but the profile could not refresh. Reload the page to see the update.",
      ),
    ).not.toBeNull();

    expect(updateUserProfile).toHaveBeenCalledTimes(1);
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("prevents closing or submitting again while saving", async () => {
    let resolveSave;

    const pendingSave = new Promise((resolve) => {
      resolveSave = resolve;
    });

    vi.mocked(updateUserProfile).mockReturnValue(pendingSave);

    renderProfile();

    const input = await openEditor();

    try {
      fireEvent.change(input, {
        target: { value: "Anna Ivanova" },
      });

      fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

      await waitFor(() => {
        expect(updateUserProfile).toHaveBeenCalledTimes(1);
        expect(screen.getByRole("button", { name: "Saving..." }).disabled).toBe(
          true,
        );
      });

      const cancelButton = screen.getByRole("button", {
        name: "Cancel",
      });

      expect(cancelButton.disabled).toBe(true);
      expect(input.readOnly).toBe(true);

      fireEvent.click(cancelButton);

      fireEvent.click(screen.getByRole("button", { name: "Saving..." }));

      expect(screen.getByRole("dialog")).not.toBeNull();
      expect(updateUserProfile).toHaveBeenCalledTimes(1);

      await act(async () => {
        resolveSave(user);
        await pendingSave;
      });

      await waitFor(() => {
        expect(screen.queryByRole("dialog")).toBeNull();
      });
    } finally {
      await act(async () => {
        resolveSave(user);
        await pendingSave;
      });
    }
  });
});
