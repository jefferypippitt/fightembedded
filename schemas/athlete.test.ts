import { describe, expect, it } from "vitest";
import { athleteSchema } from "./athlete";

describe("athleteSchema", () => {
  it("accepts a valid athlete payload", () => {
    const result = athleteSchema.safeParse({
      name: "Alex Pereira",
      gender: "MALE",
      age: 30,
      country: "Brazil",
      weightDivision: "Men's Light Heavyweight",
      wins: 10,
      losses: 2,
      draws: 0,
      winsByKo: 7,
      winsBySubmission: 0,
      followers: 1000,
      rank: 1,
      poundForPoundRank: 3,
      retired: false,
      imageUrl: "https://utfs.io/f/example",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid gender values", () => {
    const result = athleteSchema.safeParse({
      name: "Test Fighter",
      gender: "OTHER",
      age: 25,
      country: "USA",
      weightDivision: "Men's Lightweight",
      wins: 0,
      losses: 0,
      draws: 0,
      winsByKo: 0,
      winsBySubmission: 0,
      followers: 0,
      retired: false,
    });

    expect(result.success).toBe(false);
  });

  it("rejects winsByKo greater than wins", () => {
    const result = athleteSchema.safeParse({
      name: "Test Fighter",
      gender: "MALE",
      age: 25,
      country: "USA",
      weightDivision: "Men's Lightweight",
      wins: 2,
      losses: 0,
      draws: 0,
      winsByKo: 3,
      winsBySubmission: 0,
      followers: 0,
      retired: false,
    });

    expect(result.success).toBe(false);
  });

  it("rejects winsBySubmission greater than wins", () => {
    const result = athleteSchema.safeParse({
      name: "Test Fighter",
      gender: "MALE",
      age: 25,
      country: "USA",
      weightDivision: "Men's Lightweight",
      wins: 2,
      losses: 0,
      draws: 0,
      winsByKo: 0,
      winsBySubmission: 3,
      followers: 0,
      retired: false,
    });

    expect(result.success).toBe(false);
  });

  it("rejects winsByKo + winsBySubmission greater than wins even if each alone is within wins", () => {
    const result = athleteSchema.safeParse({
      name: "Test Fighter",
      gender: "MALE",
      age: 25,
      country: "USA",
      weightDivision: "Men's Lightweight",
      wins: 5,
      losses: 0,
      draws: 0,
      winsByKo: 3,
      winsBySubmission: 3,
      followers: 0,
      retired: false,
    });

    expect(result.success).toBe(false);
  });

  it("accepts winsByKo + winsBySubmission exactly equal to wins", () => {
    const result = athleteSchema.safeParse({
      name: "Test Fighter",
      gender: "MALE",
      age: 25,
      country: "USA",
      weightDivision: "Men's Lightweight",
      wins: 6,
      losses: 0,
      draws: 0,
      winsByKo: 3,
      winsBySubmission: 3,
      followers: 0,
      retired: false,
    });

    expect(result.success).toBe(true);
  });

  it("accepts zero finishes with wins greater than zero", () => {
    const result = athleteSchema.safeParse({
      name: "Test Fighter",
      gender: "MALE",
      age: 25,
      country: "USA",
      weightDivision: "Men's Lightweight",
      wins: 4,
      losses: 0,
      draws: 0,
      winsByKo: 0,
      winsBySubmission: 0,
      followers: 0,
      retired: false,
    });

    expect(result.success).toBe(true);
  });
});
