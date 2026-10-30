import { describe, expect, it } from "vitest";
import {
  botAthleteCreateSchema,
  botAthleteUpdateSchema,
  divisionMatchesGender,
  isRankedAthlete,
  parseAthleteListQuery,
  sortByDivisionRank,
} from "./bot-athletes";

describe("parseAthleteListQuery", () => {
  const parse = (query: string) =>
    parseAthleteListQuery(new URLSearchParams(query));

  it("requires a name or a division", () => {
    expect(parse("").ok).toBe(false);
    expect(parse("retired=true").ok).toBe(false);
  });

  it("parses name, division, and retired", () => {
    expect(
      parse("name=Jon&division=Men's+Heavyweight&retired=false")
    ).toEqual({
      ok: true,
      name: "Jon",
      weightDivision: "Men's Heavyweight",
      retired: false,
    });
  });

  it("rejects unknown divisions and bad retired values", () => {
    expect(parse("division=Men's+Cruiserweight").ok).toBe(false);
    expect(parse("name=Jon&retired=yes").ok).toBe(false);
  });
});

describe("sortByDivisionRank", () => {
  it("puts ranked athletes first by rank and keeps unranked order", () => {
    const sorted = sortByDivisionRank([
      { id: "a", rank: 0 },
      { id: "b", rank: 3 },
      { id: "c", rank: 0 },
      { id: "d", rank: 1 },
    ]);

    expect(sorted.map((athlete) => athlete.id)).toEqual(["d", "b", "a", "c"]);
  });
});

const validCreate = {
  name: "Jane Doe",
  gender: "FEMALE",
  weightDivision: "Women's Strawweight",
  country: "US",
  age: 27,
};

describe("divisionMatchesGender", () => {
  it("matches men's divisions to MALE and women's divisions to FEMALE", () => {
    expect(divisionMatchesGender("MALE", "Men's Lightweight")).toBe(true);
    expect(divisionMatchesGender("FEMALE", "Women's Flyweight")).toBe(true);
    expect(divisionMatchesGender("MALE", "Women's Flyweight")).toBe(false);
    expect(divisionMatchesGender("FEMALE", "Men's Flyweight")).toBe(false);
  });
});

describe("isRankedAthlete", () => {
  it("treats any division or pound-for-pound rank as ranked", () => {
    expect(isRankedAthlete({ rank: 0, poundForPoundRank: 0 })).toBe(false);
    expect(isRankedAthlete({ rank: 3, poundForPoundRank: 0 })).toBe(true);
    expect(isRankedAthlete({ rank: 0, poundForPoundRank: 7 })).toBe(true);
  });
});

describe("botAthleteCreateSchema", () => {
  it("fills defaults for counts, retired, and imageUrl", () => {
    const parsed = botAthleteCreateSchema.parse(validCreate);

    expect(parsed).toEqual({
      ...validCreate,
      wins: 0,
      losses: 0,
      draws: 0,
      winsByKo: 0,
      winsBySubmission: 0,
      followers: 0,
      retired: false,
      imageUrl: "",
    });
  });

  it("rejects a division that does not match gender", () => {
    const result = botAthleteCreateSchema.safeParse({
      ...validCreate,
      weightDivision: "Men's Lightweight",
    });

    expect(result.success).toBe(false);
  });

  it("rejects unknown divisions, negative counts, and bad image URLs", () => {
    expect(
      botAthleteCreateSchema.safeParse({
        ...validCreate,
        weightDivision: "Women's Heavyweight",
      }).success
    ).toBe(false);
    expect(
      botAthleteCreateSchema.safeParse({ ...validCreate, wins: -1 }).success
    ).toBe(false);
    expect(
      botAthleteCreateSchema.safeParse({ ...validCreate, imageUrl: "nope" })
        .success
    ).toBe(false);
  });

  it("rejects finish wins above total wins", () => {
    const result = botAthleteCreateSchema.safeParse({
      ...validCreate,
      wins: 3,
      winsByKo: 2,
      winsBySubmission: 2,
    });

    expect(result.success).toBe(false);
  });

  it("requires age", () => {
    expect(
      botAthleteCreateSchema.safeParse({ ...validCreate, age: undefined })
        .success
    ).toBe(false);
  });
});

describe("botAthleteUpdateSchema", () => {
  it("accepts the new profile fields", () => {
    const parsed = botAthleteUpdateSchema.parse({
      name: "  New Name ",
      gender: "MALE",
      country: "BR",
      imageUrl: "https://example.com/a.png",
    });

    expect(parsed).toEqual({
      name: "New Name",
      gender: "MALE",
      country: "BR",
      imageUrl: "https://example.com/a.png",
    });
  });

  it("allows an empty imageUrl to clear the image", () => {
    expect(botAthleteUpdateSchema.parse({ imageUrl: "" })).toEqual({
      imageUrl: "",
    });
  });

  it("still requires at least one field", () => {
    expect(botAthleteUpdateSchema.safeParse({}).success).toBe(false);
  });
});
