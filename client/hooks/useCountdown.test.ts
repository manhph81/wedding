import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { useCountdown } from "./useCountdown";

describe("useCountdown", () => {
  it("trả về done=true cho ngày trong quá khứ", () => {
    const { result } = renderHook(() => useCountdown("2000-01-01T00:00:00Z"));
    expect(result.current.done).toBe(true);
    expect(result.current.days).toBe(0);
  });

  it("trả về số ngày dương cho ngày tương lai", () => {
    const future = new Date(Date.now() + 3 * 86_400_000).toISOString();
    const { result } = renderHook(() => useCountdown(future));
    expect(result.current.days).toBeGreaterThanOrEqual(2);
    expect(result.current.done).toBe(false);
  });
});
