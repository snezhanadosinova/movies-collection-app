import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import MovieDetailsSkeleton from "@/features/movies/components/MovieDetailsSkeleton";
import PersonDetailsSkeleton from "@/features/people/components/PersonDetailsSkeleton";
import FavoritesSkeleton from "@/features/favorites/pages/FavoritesSkeleton";
import ProfileSkeleton from "@/features/profile/components/ProfileSkeleton";
import FeaturedSkeleton from "@/components/movie/FeaturedSkeleton";

describe("page skeleton accessibility", () => {
  it.each([
    ["Loading movie", MovieDetailsSkeleton],
    ["Loading person", PersonDetailsSkeleton],
    ["Loading favorites", FavoritesSkeleton],
    ["Loading featured movies", FeaturedSkeleton],
  ])("announces the loading state for %s", (label, Component) => {
    render(<Component />);
    expect(screen.getByRole("status", { name: label })).not.toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
  });
  it("reserves profile and favorite layouts without showing an empty collection", () => {
    render(<MemoryRouter><ProfileSkeleton /></MemoryRouter>);
    expect(screen.getByRole("status", { name: "Loading profile" })).not.toBeNull();
    expect(screen.queryByText(/No favorites yet/)).toBeNull();
    expect(screen.getAllByRole("listitem")).toHaveLength(6);
  });
});
