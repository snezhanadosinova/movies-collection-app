import { describe, expect, it } from "vitest";
import { getPersonReturnState } from "@/utils/personReturn";

describe("person return destination", () => {
  it.each(["/people/7", "/people/7?type=tv#credits"])("preserves %s", (fromPerson) => {
    expect(getPersonReturnState({ fromPerson, ignored: true })).toEqual({ fromPerson });
  });
  it.each([undefined, null, "https://example.com", "//example.com", "/login", "/people/0", "/people/7/other", "/people/7?x=\\evil"])(
    "rejects invalid destination %s", (fromPerson) => {
      expect(getPersonReturnState({ fromPerson })).toBeUndefined();
    },
  );
});