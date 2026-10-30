import { afterEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { readJsonBody, validateBearerToken } from "./bot-auth";

function requestWith(authorization?: string) {
  const headers = new Headers();
  if (authorization !== undefined) {
    headers.set("Authorization", authorization);
  }
  return new NextRequest("http://localhost/api/bot/athletes", { headers });
}

describe("validateBearerToken", () => {
  const original = process.env.BOT_API_SECRET;

  afterEach(() => {
    process.env.BOT_API_SECRET = original;
  });

  it("accepts the configured secret", () => {
    process.env.BOT_API_SECRET = "s3cret";
    expect(validateBearerToken(requestWith("Bearer s3cret"))).toBe(true);
  });

  it("rejects wrong, shorter, longer, and missing tokens", () => {
    process.env.BOT_API_SECRET = "s3cret";
    expect(validateBearerToken(requestWith("Bearer s3creT"))).toBe(false);
    expect(validateBearerToken(requestWith("Bearer s3"))).toBe(false);
    expect(validateBearerToken(requestWith("Bearer s3cret-extra"))).toBe(false);
    expect(validateBearerToken(requestWith("Basic s3cret"))).toBe(false);
    expect(validateBearerToken(requestWith())).toBe(false);
  });

  it("rejects everything when the secret is not configured", () => {
    delete process.env.BOT_API_SECRET;
    expect(validateBearerToken(requestWith("Bearer anything"))).toBe(false);
  });
});

describe("readJsonBody", () => {
  it("parses valid JSON", async () => {
    const result = await readJsonBody(
      new Request("http://localhost", { method: "POST", body: '{"a":1}' })
    );
    expect(result).toEqual({ ok: true, body: { a: 1 } });
  });

  it("reports malformed JSON instead of throwing", async () => {
    const result = await readJsonBody(
      new Request("http://localhost", { method: "POST", body: "{nope" })
    );
    expect(result).toEqual({ ok: false });
  });
});
