import { describe, expect, it } from "vitest";
import {
  DIVISION_MAX_RANK,
  P4P_MAX_RANK,
  diffRankChanges,
  divisionStartRank,
  hasForbiddenRankFields,
  parseRankingsQuery,
  validateDivisionRankingAthletes,
  validateP4pRankingAthletes,
  validateRankingAssignments,
  type RankingAthlete,
} from "./rankings";

const divisionOptions = {
  maxRank: DIVISION_MAX_RANK,
  startRank: 1,
};

function ranks(ids: string[], start = 1) {
  return ids.map((athleteId, index) => ({
    athleteId,
    rank: start + index,
  }));
}

describe("validateRankingAssignments", () => {
  it("accepts a contiguous division ranking starting at 1", () => {
    expect(
      validateRankingAssignments(ranks(["a", "b", "c"]), divisionOptions)
    ).toEqual([]);
  });

  it("accepts a full 16-fighter division board", () => {
    const ids = Array.from({ length: 16 }, (_, index) => `athlete-${index}`);
    expect(validateRankingAssignments(ranks(ids), divisionOptions)).toEqual([]);
  });

  it("accepts an empty board", () => {
    expect(validateRankingAssignments([], divisionOptions)).toEqual([]);
  });

  it("accepts vacant-champion ranks starting at 2", () => {
    expect(
      validateRankingAssignments(ranks(["a", "b"], 2), {
        maxRank: DIVISION_MAX_RANK,
        startRank: divisionStartRank(true),
        vacantChampion: true,
      })
    ).toEqual([]);
  });

  it("rejects a gap in the ranking", () => {
    expect(
      validateRankingAssignments(
        [
          { athleteId: "a", rank: 1 },
          { athleteId: "b", rank: 3 },
        ],
        divisionOptions
      )
    ).toEqual(["Ranks must be unique and contiguous starting at 1"]);
  });

  it("rejects rank 1 when the champion is vacant", () => {
    expect(
      validateRankingAssignments(
        [
          { athleteId: "a", rank: 1 },
          { athleteId: "b", rank: 2 },
        ],
        {
          maxRank: DIVISION_MAX_RANK,
          startRank: 2,
          vacantChampion: true,
        }
      )
    ).toEqual(["Rank 1 for a must be between 2 and 16"]);
  });

  it("rejects duplicate athlete ids and duplicate ranks", () => {
    expect(
      validateRankingAssignments(
        [
          { athleteId: "a", rank: 1 },
          { athleteId: "a", rank: 1 },
        ],
        divisionOptions
      )
    ).toEqual(["Duplicate athleteId: a", "Duplicate rank: 1"]);
  });

  it("rejects rank 0 and ranks above 16", () => {
    expect(
      validateRankingAssignments(
        [
          { athleteId: "a", rank: 0 },
          { athleteId: "b", rank: 17 },
        ],
        divisionOptions
      )
    ).toEqual([
      "Rank 0 for a must be between 1 and 16",
      "Rank 17 for b must be between 1 and 16",
    ]);
  });

  it("rejects more than 16 division ranks", () => {
    const ids = Array.from({ length: 17 }, (_, index) => `athlete-${index}`);
    const errors = validateRankingAssignments(ranks(ids), divisionOptions);
    expect(errors).toContain("At most 16 athletes can be ranked");
  });

  it("rejects a 16th pound-for-pound rank", () => {
    const ids = Array.from({ length: 16 }, (_, index) => `athlete-${index}`);
    const errors = validateRankingAssignments(ranks(ids), {
      maxRank: P4P_MAX_RANK,
      startRank: 1,
    });
    expect(errors).toContain("At most 15 athletes can be ranked");
    expect(errors).toContain("Rank 16 for athlete-15 must be between 1 and 15");
  });

  it("accepts pound-for-pound ranks 1 through 15", () => {
    const ids = Array.from({ length: 15 }, (_, index) => `athlete-${index}`);
    expect(
      validateRankingAssignments(ranks(ids), {
        maxRank: P4P_MAX_RANK,
        startRank: 1,
      })
    ).toEqual([]);
  });

  it("rejects a non-integer rank", () => {
    expect(
      validateRankingAssignments(
        [{ athleteId: "a", rank: 1.5 }],
        divisionOptions
      )
    ).toEqual(["Rank for a must be an integer"]);
  });
});

describe("division membership", () => {
  const athletes: RankingAthlete[] = [
    {
      id: "in-division",
      name: "In Division",
      retired: false,
      weightDivision: "Men's Lightweight",
      gender: "MALE",
    },
    {
      id: "other-division",
      name: "Other Division",
      retired: false,
      weightDivision: "Men's Welterweight",
      gender: "MALE",
    },
    {
      id: "retired",
      name: "Retired Fighter",
      retired: true,
      weightDivision: "Men's Lightweight",
      gender: "MALE",
    },
    {
      id: "unretired-null",
      name: "Legacy Active",
      retired: null,
      weightDivision: "Men's Lightweight",
      gender: "MALE",
    },
  ];

  it("rejects missing, out-of-division, and retired athletes", () => {
    expect(
      validateDivisionRankingAthletes(
        [
          { athleteId: "missing", rank: 1 },
          { athleteId: "other-division", rank: 2 },
          { athleteId: "retired", rank: 3 },
        ],
        athletes,
        "Men's Lightweight"
      )
    ).toEqual([
      "Athlete not found: missing",
      "Other Division (other-division) is not in Men's Lightweight",
      "Retired Fighter (retired) is retired",
    ]);
  });

  it("allows active athletes and legacy null retired flags", () => {
    expect(
      validateDivisionRankingAthletes(
        [
          { athleteId: "in-division", rank: 1 },
          { athleteId: "unretired-null", rank: 2 },
        ],
        athletes,
        "Men's Lightweight"
      )
    ).toEqual([]);
  });
});

describe("pound-for-pound membership", () => {
  const athletes: RankingAthlete[] = [
    {
      id: "man",
      name: "Male Fighter",
      retired: false,
      weightDivision: "Men's Lightweight",
      gender: "MALE",
    },
    {
      id: "woman",
      name: "Female Fighter",
      retired: false,
      weightDivision: "Women's Strawweight",
      gender: "FEMALE",
    },
    {
      id: "retired-man",
      name: "Retired Man",
      retired: true,
      weightDivision: "Men's Heavyweight",
      gender: "MALE",
    },
  ];

  it("rejects the wrong gender and retired athletes", () => {
    expect(
      validateP4pRankingAthletes(
        [
          { athleteId: "woman", rank: 1 },
          { athleteId: "retired-man", rank: 2 },
          { athleteId: "gone", rank: 3 },
        ],
        athletes,
        "MALE"
      )
    ).toEqual([
      "Female Fighter (woman) is not MALE",
      "Retired Man (retired-man) is retired",
      "Athlete not found: gone",
    ]);
  });

  it("accepts an active athlete of the requested gender", () => {
    expect(
      validateP4pRankingAthletes(
        [{ athleteId: "man", rank: 1 }],
        athletes,
        "MALE"
      )
    ).toEqual([]);
  });
});

describe("diffRankChanges", () => {
  const scope = [
    { id: "a", name: "Alpha", rank: 1 },
    { id: "b", name: "Bravo", rank: 2 },
    { id: "c", name: "Charlie", rank: 0 },
    { id: "d", name: "Delta", rank: 4 },
  ];

  it("returns only athletes whose rank changes and unranks everyone omitted", () => {
    expect(
      diffRankChanges(scope, [
        { athleteId: "b", rank: 1 },
        { athleteId: "c", rank: 2 },
      ])
    ).toEqual([
      { athleteId: "b", name: "Bravo", before: 2, after: 1 },
      { athleteId: "c", name: "Charlie", before: 0, after: 2 },
      { athleteId: "a", name: "Alpha", before: 1, after: 0 },
      { athleteId: "d", name: "Delta", before: 4, after: 0 },
    ]);
  });

  it("returns an empty diff when the board is unchanged", () => {
    expect(
      diffRankChanges(scope, [
        { athleteId: "a", rank: 1 },
        { athleteId: "b", rank: 2 },
        { athleteId: "d", rank: 4 },
      ])
    ).toEqual([]);
  });

  it("unranks the whole scope when the payload is empty", () => {
    expect(diffRankChanges(scope, [])).toEqual([
      { athleteId: "a", name: "Alpha", before: 1, after: 0 },
      { athleteId: "b", name: "Bravo", before: 2, after: 0 },
      { athleteId: "d", name: "Delta", before: 4, after: 0 },
    ]);
  });
});

describe("parseRankingsQuery", () => {
  it("parses a division query", () => {
    expect(
      parseRankingsQuery({
        division: "Men's Flyweight",
        p4p: null,
      })
    ).toEqual({
      ok: true,
      kind: "division",
      weightDivision: "Men's Flyweight",
    });
  });

  it("parses a pound-for-pound gender case-insensitively", () => {
    expect(parseRankingsQuery({ division: null, p4p: "female" })).toEqual({
      ok: true,
      kind: "p4p",
      gender: "FEMALE",
    });
  });

  it("rejects missing, combined, and unknown filters", () => {
    expect(parseRankingsQuery({ division: null, p4p: null }).ok).toBe(false);
    expect(
      parseRankingsQuery({
        division: "Men's Flyweight",
        p4p: "MALE",
      }).ok
    ).toBe(false);
    expect(
      parseRankingsQuery({ division: "Lightweight", p4p: null }).ok
    ).toBe(false);
    expect(parseRankingsQuery({ division: null, p4p: "OTHER" }).ok).toBe(
      false
    );
  });
});

describe("hasForbiddenRankFields", () => {
  it("detects rank fields on an object body", () => {
    expect(hasForbiddenRankFields({ wins: 1, rank: 2 })).toBe(true);
    expect(hasForbiddenRankFields({ poundForPoundRank: 0 })).toBe(true);
    expect(hasForbiddenRankFields({ wins: 1 })).toBe(false);
    expect(hasForbiddenRankFields(null)).toBe(false);
    expect(hasForbiddenRankFields([{ rank: 1 }])).toBe(false);
  });
});
