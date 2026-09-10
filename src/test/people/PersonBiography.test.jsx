import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PersonBiography } from "@/features/people/components/PersonBiography";

describe("PersonBiography", () => {
  it("expands the complete biography inside the same paragraph", () => {
    const biography =
      "Alice began her acting career in theatre. ".repeat(25) +
      "This is the final sentence.";

    render(<PersonBiography biography={biography} />);

    const button = screen.getByRole("button", { name: "Read more" });
    const paragraph = document.getElementById(
      button.getAttribute("aria-controls"),
    );

    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(paragraph.textContent).not.toBe(biography);

    fireEvent.click(button);

    expect(paragraph.textContent).toBe(biography);
    expect(paragraph.tagName).toBe("P");

    const collapseButton = screen.getByRole("button", {
      name: "Read less",
    });

    expect(
      document.getElementById(
        collapseButton.getAttribute("aria-controls"),
      ),
    ).toBe(paragraph);

    expect(collapseButton.getAttribute("aria-expanded")).toBe("true");

    fireEvent.click(collapseButton);

    expect(paragraph.textContent).not.toBe(biography);
    expect(
      screen.getByRole("button", { name: "Read more" })
        .getAttribute("aria-expanded"),
    ).toBe("false");
  });

  it("shows a short biography without an expand button", () => {
    render(<PersonBiography biography="An actor and director." />);

    expect(screen.queryByText("An actor and director.")).not.toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("handles missing biography", () => {
    render(<PersonBiography />);

    expect(
      screen.queryByText("Biography is unavailable."),
    ).not.toBeNull();
  });
});