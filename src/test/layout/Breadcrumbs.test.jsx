import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { BreadcrumbHostContext } from "@/components/layout/breadcrumbContext";

function Destination() {
  const location = useLocation();
  return <output data-testid="destination">{JSON.stringify({ path: location.pathname + location.search, state: location.state })}</output>;
}

describe("Breadcrumbs", () => {
  it("marks the current page and preserves catalog filters and scroll state", () => {
    render(<MemoryRouter>
      <Breadcrumbs to="/movies?genre=27" label="Browse movies" current="A movie"
        state={{ restoreScrollKey: "catalog-key" }} />
      <Destination />
    </MemoryRouter>);
    const navigation = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(within(navigation).getByText("A movie").getAttribute("aria-current")).toBe("page");
    expect(within(navigation).queryByRole("link", { name: "A movie" })).toBeNull();
    fireEvent.click(within(navigation).getByRole("link", { name: "Browse movies" }));
    expect(JSON.parse(screen.getByTestId("destination").textContent)).toEqual({
      path: "/movies?genre=27", state: { restoreScrollKey: "catalog-key" },
    });
  });

  it("renders in the header host and removes its content when unmounted", () => {
    const host = document.createElement("div");
    document.body.append(host);
    try {
      const { unmount, container } = render(<MemoryRouter>
        <BreadcrumbHostContext.Provider value={host}>
          <Breadcrumbs to="/tv/42" label="Back to series" current="Season 1" />
        </BreadcrumbHostContext.Provider>
      </MemoryRouter>);
      expect(within(host).getByRole("navigation", { name: "Breadcrumb" })).not.toBeNull();
      expect(container.querySelector("nav")).toBeNull();
      unmount();
      expect(host.childElementCount).toBe(0);
    } finally {
      host.remove();
    }
  });
});