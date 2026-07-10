import { describe, expect, it } from "vitest";
import { isUnauthorizedError } from "./action-errors";

describe("isUnauthorizedError", () => {
  it("returns true for an Unauthorized error", () => {
    expect(isUnauthorizedError(new Error("Unauthorized"))).toBe(true);
  });

  it("returns false for other Error messages", () => {
    expect(isUnauthorizedError(new Error("Failed to fetch athlete"))).toBe(
      false
    );
  });

  it("returns false for null", () => {
    expect(isUnauthorizedError(null)).toBe(false);
  });

  it("returns false for a plain string", () => {
    expect(isUnauthorizedError("Unauthorized")).toBe(false);
  });
});
