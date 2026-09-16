import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";
import { describe, expect, it } from "vitest";
import MobileNavigation from "@/components/layout/MobileNavigation";

function NavigationHarness() {
  const location = useLocation();
  return (
    <>
      <MobileNavigation key={location.key} />
      <p data-testid="current-path">{location.pathname}</p>
      <button type="button">Outside navigation</button>
    </>
  );
}

function setup() {
  const user = userEvent.setup();
  render(<MemoryRouter><NavigationHarness /></MemoryRouter>);
  return user;
}

describe("Mobile navigation", () => {
  it("opens public links and indicates the current page", async () => {
    const user = setup();
    expect(screen.queryByRole("link", { name: "Movies" })).toBeNull();
    await user.click(screen.getByRole("button", { name: "Open navigation menu" }));
    expect(screen.getByRole("button", { name: "Close navigation menu" }).getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("link", { name: "Home" }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("link", { name: "TV Series" })).not.toBeNull();
  });

  it("closes after navigation", async () => {
    const user = setup();
    await user.click(screen.getByRole("button", { name: "Open navigation menu" }));
    await user.click(screen.getByRole("link", { name: "Movies" }));
    expect(screen.getByTestId("current-path").textContent).toBe("/movies");
    expect(screen.queryByRole("link", { name: "Movies" })).toBeNull();
  });

  it("supports keyboard opening and Escape with focus restored", async () => {
    const user = setup();
    const trigger = screen.getByRole("button", { name: "Open navigation menu" });
    trigger.focus();
    await user.keyboard("{Enter}");
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Home" }));
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("link", { name: "Home" })).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });

  it("closes when clicking outside", async () => {
    const user = setup();
    await user.click(screen.getByRole("button", { name: "Open navigation menu" }));
    await user.click(screen.getByRole("button", { name: "Outside navigation" }));
    await waitFor(() => expect(screen.queryByRole("link", { name: "Movies" })).toBeNull());
  });
});
