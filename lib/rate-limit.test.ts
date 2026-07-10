import { describe, expect, it } from "vitest";
import { rateLimit } from "./rate-limit";

describe("rateLimit", () => {
  it("allows requests under the configured limit", async () => {
    const key = `test-${Date.now()}-under`;

    const first = await rateLimit(key, { limit: 2, window: 60 });
    const second = await rateLimit(key, { limit: 2, window: 60 });

    expect(first.success).toBe(true);
    expect(second.success).toBe(true);
    expect(second.remaining).toBe(0);
  });

  it("blocks requests above the configured limit", async () => {
    const key = `test-${Date.now()}-over`;

    await rateLimit(key, { limit: 1, window: 60 });
    const blocked = await rateLimit(key, { limit: 1, window: 60 });

    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
  });
});
