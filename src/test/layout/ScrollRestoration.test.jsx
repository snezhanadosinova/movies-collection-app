import { act, cleanup, render } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import MainLayout from "@/components/layout/MainLayout";

vi.mock("@/components/layout/Navbar", () => ({ default: () => null }));
vi.mock("@/components/layout/Footer", () => ({ default: () => null }));

let router;
let scrollTo;
beforeEach(() => {
  scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  vi.spyOn(window, "scrollY", "get").mockReturnValue(0);
});
afterEach(() => {
  cleanup();
  router?.dispose();
  vi.restoreAllMocks();
});

function setup() {
  router = createMemoryRouter([{
    element: <MainLayout />,
    children: [
      { path: "/movies", element: <h1>Movies</h1> },
      { path: "/movies/:id", element: <h1>Movie details</h1> },
    ],
  }], { initialEntries: ["/movies"] });
  render(<RouterProvider router={router} />);
  scrollTo.mockClear();
}

describe("layout scroll restoration", () => {
  it("starts a new details entry at the top and restores the catalog on Back", async () => {
    setup();

    vi.spyOn(window, "scrollY", "get").mockReturnValue(1250);
    await act(async () => { await router.navigate("/movies/42"); });
    expect(scrollTo).toHaveBeenLastCalledWith(0, 0);
    vi.spyOn(window, "scrollY", "get").mockReturnValue(300);
    await act(async () => { await router.navigate(-1); });
    expect(scrollTo).toHaveBeenLastCalledWith(0, 1250);
  });

  it("restores the source position for an explicit return link", async () => {
    setup();
    const sourceKey = router.state.location.key;
    vi.spyOn(window, "scrollY", "get").mockReturnValue(1600);
    await act(async () => { await router.navigate("/movies/42"); });
    await act(async () => {
      await router.navigate("/movies", { state: { restoreScrollKey: sourceKey } });
    });
    expect(scrollTo).toHaveBeenLastCalledWith(0, 1600);
  });
  it("honors preventScrollReset when filters change", async () => {
    setup();
    await act(async () => {
      await router.navigate("/movies?q=alien&genre=27", {
        replace: true, preventScrollReset: true,
      });
    });
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("treats a new catalog link as a fresh entry rather than browser Back", async () => {
    setup();
    vi.spyOn(window, "scrollY", "get").mockReturnValue(1250);
    await act(async () => { await router.navigate("/movies/42"); });
    scrollTo.mockClear();
    await act(async () => { await router.navigate("/movies"); });
    expect(scrollTo).toHaveBeenLastCalledWith(0, 0);
  });
});
