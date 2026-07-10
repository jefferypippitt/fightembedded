import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({
  headers: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getRateLimitIdentifier, rateLimit } from "./rate-limit";

const mockHeaders = vi.mocked(headers);
const mockGetSession = vi.mocked(auth.api.getSession);

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

describe("getRateLimitIdentifier", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a user-scoped identifier when a session exists", async () => {
    mockHeaders.mockResolvedValue(new Headers());
    mockGetSession.mockResolvedValue({
      user: { id: "user-123" },
    } as Awaited<ReturnType<typeof auth.api.getSession>>);

    await expect(getRateLimitIdentifier()).resolves.toBe(
      "rate-limit:user:user-123"
    );
  });

  it("falls back to the first forwarded IP when no session exists", async () => {
    mockHeaders.mockResolvedValue(
      new Headers({ "x-forwarded-for": "203.0.113.1, 198.51.100.2" })
    );
    mockGetSession.mockResolvedValue(null);

    await expect(getRateLimitIdentifier()).resolves.toBe(
      "rate-limit:ip:203.0.113.1"
    );
  });

  it("returns an unknown IP identifier when no session or headers exist", async () => {
    mockHeaders.mockResolvedValue(new Headers());
    mockGetSession.mockResolvedValue(null);

    await expect(getRateLimitIdentifier()).resolves.toBe(
      "rate-limit:ip:unknown"
    );
  });
});
