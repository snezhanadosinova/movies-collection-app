import { describe, expect, it, vi } from "vitest";
import { createRequestQueue } from "@/features/favorites/utils/requestQueue";

describe("favorite request queue", () => {
  it("limits concurrent requests and starts waiting work when a slot opens", async () => {
    const queue = createRequestQueue(2);
    let release;
    const blocked = new Promise((resolve) => { release = resolve; });
    const first = vi.fn(() => blocked);
    const next = vi.fn(async () => "third");
    const a = queue(first);
    const b = queue(first);
    const c = queue(next);
    await Promise.resolve();
    expect(first).toHaveBeenCalledTimes(2);
    expect(next).not.toHaveBeenCalled();
    release();
    await Promise.all([a, b, c]);
    expect(next).toHaveBeenCalledTimes(1);
  });
  it("does not execute a queued request after cancellation", async () => {
    const queue = createRequestQueue(1);
    let release;
    const first = queue(() => new Promise((resolve) => { release = resolve; }));
    await Promise.resolve();
    const controller = new AbortController();
    const run = vi.fn();
    const cancelled = queue(run, controller.signal);
    const rejected = expect(cancelled).rejects.toHaveProperty("name", "AbortError");
    controller.abort();
    await rejected;
    release();
    await first;
    expect(run).not.toHaveBeenCalled();
  });
});
