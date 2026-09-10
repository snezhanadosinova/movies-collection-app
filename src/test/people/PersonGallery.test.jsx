import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PersonGallery } from "@/features/people/components/PersonGallery";

const photos = Array.from({ length: 14 }, (_, index) => ({
  file_path: `/photo-${index + 1}.jpg`,
}));

describe("PersonGallery", () => {
  it("reveals six more photos at a time and hides Load More at the end", () => {
    render(<PersonGallery photos={photos} name="Alice" />);

    const thumbnails = () =>
      screen.getAllByRole("button", { name: /^Open photo/ });

    expect(thumbnails()).toHaveLength(6);

    fireEvent.click(screen.getByRole("button", { name: "Load More" }));

    expect(thumbnails()).toHaveLength(12);

    fireEvent.click(screen.getByRole("button", { name: "Load More" }));

    expect(thumbnails()).toHaveLength(14);
    expect(
      screen.queryByRole("button", { name: "Load More" }),
    ).toBeNull();
  });

  it("opens the selected photo and supports buttons and arrow keys", async () => {
    render(<PersonGallery photos={photos} name="Alice" />);

    fireEvent.click(
      screen.getByRole("button", { name: "Open photo 2 of Alice" }),
    );

    const dialog = await screen.findByRole("dialog", {
      name: "Photos of Alice",
    });

    expect(
      within(dialog).getByRole("img").getAttribute("alt"),
    ).toBe("Photo 2 of Alice");

    fireEvent.click(
      within(dialog).getByRole("button", { name: "Next photo" }),
    );

    expect(
      within(dialog).getByRole("img").getAttribute("alt"),
    ).toBe("Photo 3 of Alice");

    fireEvent.keyDown(dialog, { key: "ArrowLeft" });

    expect(
      within(dialog).getByRole("img").getAttribute("alt"),
    ).toBe("Photo 2 of Alice");

    fireEvent.click(
      within(dialog).getByRole("button", { name: "Previous photo" }),
    );

    expect(
      within(dialog).getByRole("img").getAttribute("alt"),
    ).toBe("Photo 1 of Alice");

    fireEvent.keyDown(dialog, { key: "ArrowLeft" });

    expect(
      within(dialog).getByRole("img").getAttribute("alt"),
    ).toBe("Photo 14 of Alice");
  });

  it("closes with Escape and restores focus to the thumbnail", async () => {
    render(<PersonGallery photos={photos} name="Alice" />);

    const thumbnail = screen.getByRole("button", {
      name: "Open photo 1 of Alice",
    });

    thumbnail.focus();
    fireEvent.click(thumbnail);

    const dialog = await screen.findByRole("dialog");
    const closeButton = within(dialog).getByRole("button", {
      name: "Close gallery",
    });

    await waitFor(() => {
      expect(dialog.contains(document.activeElement)).toBe(true);
    });

    closeButton.focus();
    fireEvent.keyDown(closeButton, { key: "Escape" });

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
      expect(document.activeElement).toBe(thumbnail);
    });
  });

  it("omits pagination and navigation for a single photo", async () => {
    render(<PersonGallery photos={[photos[0]]} name="Alice" />);

    expect(
      screen.queryByRole("button", { name: "Load More" }),
    ).toBeNull();

    fireEvent.click(
      screen.getByRole("button", { name: "Open photo 1 of Alice" }),
    );

    const dialog = await screen.findByRole("dialog");

    expect(
      within(dialog).queryByRole("button", { name: "Next photo" }),
    ).toBeNull();

    expect(
      within(dialog).queryByRole("button", { name: "Previous photo" }),
    ).toBeNull();

    fireEvent.click(
      within(dialog).getByRole("button", { name: "Close gallery" }),
    );

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
  });

  it("does not render an empty gallery", () => {
    render(<PersonGallery photos={[]} name="Alice" />);

    expect(
      screen.queryByRole("heading", { name: "Photos" }),
    ).toBeNull();
  });
});