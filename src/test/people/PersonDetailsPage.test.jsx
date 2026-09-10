import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import PersonDetailsPage from "@/features/people/pages/PersonDetailsPage";
import { usePersonDetails } from "@/features/people/hooks/usePersonDetails";

vi.mock("@/features/people/hooks/usePersonDetails", () => ({
  usePersonDetails: vi.fn(),
}));

let queryState;

beforeEach(() => {
  queryState = {
    data: undefined,
    isLoading: false,
    isError: false,
    isInvalidId: false,
    error: null,
    isFetching: false,
    refetch: vi.fn(),
  };

  vi.mocked(usePersonDetails).mockImplementation(() => queryState);
});

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/people/123"]}>
      <Routes>
        <Route path="/people/:id" element={<PersonDetailsPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("PersonDetailsPage", () => {
  it("shows the loading skeleton", () => {
    queryState.isLoading = true;

    renderPage();

    expect(
      screen.queryByRole("status", { name: "Loading person" }),
    ).not.toBeNull();

    expect(usePersonDetails).toHaveBeenCalledWith("123");
  });

  it("shows available information when optional fields are missing", () => {
    queryState.data = {
      id: 123,
      name: "Alice",
    };

    renderPage();

    expect(
      screen.queryByRole("heading", { level: 1, name: "Alice" }),
    ).not.toBeNull();

    expect(screen.queryByText("Photo unavailable")).not.toBeNull();
    expect(
      screen.queryByText("Biography is unavailable."),
    ).not.toBeNull();

    expect(
      screen.queryByText("Filmography is unavailable."),
    ).not.toBeNull();
  });

  it("retries an initial request failure", () => {
    queryState.isError = true;

    renderPage();

    fireEvent.click(screen.getByRole("button", { name: "Retry" }));

    expect(queryState.refetch).toHaveBeenCalledWith({
      cancelRefetch: false,
    });
  });

  it("shows a not-found page for a 404 response", () => {
    queryState.isError = true;
    queryState.error = { response: { status: 404 } };

    renderPage();

    expect(
      screen.queryByRole("heading", { name: "Person not found" }),
    ).not.toBeNull();

    expect(
      screen.queryByRole("button", { name: "Retry" }),
    ).toBeNull();
  });

  it("preserves the profile when a background refresh fails", () => {
    queryState.data = { id: 123, name: "Alice" };
    queryState.isError = true;

    renderPage();

    expect(
      screen.queryByRole("heading", { level: 1, name: "Alice" }),
    ).not.toBeNull();

    expect(screen.getByRole("alert").textContent).toBe(
      "Could not refresh this profile. Showing available information.",
    );
  });
});