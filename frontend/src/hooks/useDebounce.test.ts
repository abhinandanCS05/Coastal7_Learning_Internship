import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
  it("delays the returned value", async () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      {
        initialProps: { value: "phone" },
      },
    );

    expect(result.current).toBe("phone");

    rerender({ value: "laptop" });

    expect(result.current).toBe("phone");

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe("laptop");

    vi.useRealTimers();
  });
});
