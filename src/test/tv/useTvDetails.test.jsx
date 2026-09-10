import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";
import { useTvDetails } from "@/features/tv/hooks/useTvDetails";
import { getTvDetails } from "@/features/tv/api/tvApi";

vi.mock("@/features/tv/api/tvApi", () => ({ getTvDetails: vi.fn() }));

function setup(id) {
  const client = new QueryClient();
  function Wrapper({ children }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  }
  const hook = renderHook(() => useTvDetails(id), { wrapper: Wrapper });
  return { ...hook, dispose: () => { hook.unmount(); client.clear(); } };
}

describe("useTvDetails", () => {
  it("does not request an invalid ID", () => {
    vi.mocked(getTvDetails).mockReset();
    const { result, dispose } = setup("abc");
    try {
      expect(result.current.isInvalidId).toBe(true);
      expect(getTvDetails).not.toHaveBeenCalled();
    } finally { dispose(); }
  });

  it("loads series details with a cancellation signal", async () => {
    vi.mocked(getTvDetails).mockReset().mockResolvedValue({ id: 42, name: "Example" });
    const { result, dispose } = setup("42");
    try {
      await waitFor(() => expect(result.current.data?.name).toBe("Example"));
      expect(getTvDetails).toHaveBeenCalledWith("42", expect.any(AbortSignal));
    } finally { dispose(); }
  });

  it("does not retry a missing series", async () => {
    vi.mocked(getTvDetails).mockReset().mockRejectedValue({ response: { status: 404 } });
    const { result, dispose } = setup("42");
    try {
      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(getTvDetails).toHaveBeenCalledTimes(1);
    } finally { dispose(); }
  });
});
