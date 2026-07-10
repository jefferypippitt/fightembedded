import { describe, expect, it } from "vitest";
import { athleteInputFromFormData } from "./athlete-form-data";

function buildFormData(overrides: Record<string, string> = {}): FormData {
  const base: Record<string, string> = {
    name: "Alex Pereira",
    gender: "MALE",
    weightDivision: "Men's Light Heavyweight",
    country: "Brazil",
    age: "30",
    wins: "10",
    losses: "2",
    draws: "0",
    winsByKo: "7",
    winsBySubmission: "0",
    followers: "1000",
    rank: "1",
    poundForPoundRank: "3",
    imageUrl: "https://utfs.io/f/example",
    retired: "false",
    ...overrides,
  };

  const formData = new FormData();
  for (const [key, value] of Object.entries(base)) {
    formData.set(key, value);
  }
  return formData;
}

describe("athleteInputFromFormData", () => {
  it("parses a valid FormData payload", () => {
    const result = athleteInputFromFormData(buildFormData());

    expect(result).toMatchObject({
      name: "Alex Pereira",
      gender: "MALE",
      weightDivision: "Men's Light Heavyweight",
      country: "Brazil",
      age: 30,
      wins: 10,
      losses: 2,
      draws: 0,
      winsByKo: 7,
      winsBySubmission: 0,
      followers: 1000,
      rank: 1,
      poundForPoundRank: 3,
      imageUrl: "https://utfs.io/f/example",
      retired: false,
    });
  });

  it("throws for an invalid gender value", () => {
    expect(() =>
      athleteInputFromFormData(buildFormData({ gender: "OTHER" }))
    ).toThrow();
  });

  it("throws when winsByKo + winsBySubmission exceed wins", () => {
    expect(() =>
      athleteInputFromFormData(
        buildFormData({ wins: "5", winsByKo: "3", winsBySubmission: "3" })
      )
    ).toThrow();
  });

  it("throws when age is not a number", () => {
    expect(() =>
      athleteInputFromFormData(buildFormData({ age: "abc" }))
    ).toThrow();
  });
});
