import { describe, expect, it } from "vitest";
import { z } from "zod";
import { eventInputFromFormData } from "./event-form-data";

function buildFormData(overrides: Record<string, string> = {}): FormData {
  const base: Record<string, string> = {
    name: "UFC 300",
    date: "2026-04-13T00:00:00.000Z",
    venue: "T-Mobile Arena",
    location: "Las Vegas, NV",
    mainEvent: "Fighter A vs Fighter B",
    status: "UPCOMING",
    ...overrides,
  };

  const formData = new FormData();
  for (const [key, value] of Object.entries(base)) {
    formData.set(key, value);
  }
  return formData;
}

describe("eventInputFromFormData", () => {
  it("parses a valid FormData payload", () => {
    const result = eventInputFromFormData(
      buildFormData({ coMainEvent: "Fighter C vs Fighter D" })
    );

    expect(result).toMatchObject({
      name: "UFC 300",
      venue: "T-Mobile Arena",
      location: "Las Vegas, NV",
      mainEvent: "Fighter A vs Fighter B",
      coMainEvent: "Fighter C vs Fighter D",
      status: "UPCOMING",
    });
    expect(result.date).toBeInstanceOf(Date);
  });

  it("throws when a required field fails validation", () => {
    expect(() => eventInputFromFormData(buildFormData({ venue: "A" }))).toThrow(
      z.ZodError
    );
  });

  it("leaves coMainEvent undefined when omitted", () => {
    const result = eventInputFromFormData(buildFormData());

    expect(result.coMainEvent).toBeUndefined();
  });
});
