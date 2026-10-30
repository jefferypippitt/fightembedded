import { z } from "zod";
import { weightClasses } from "@/data/weight-class";

/**
 * Division rank: 1 is champion, 2–16 are UFC #1–#15, 0 is unranked.
 * Pound-for-pound rank is 1–15 per gender, and 0 is unranked.
 * A rankings payload is the full board. Omitted athletes are set to 0.
 */

export const DIVISION_MAX_RANK = 16;
export const P4P_MAX_RANK = 15;

const validWeightDivisions = [
  ...weightClasses.men.map((division) => `Men's ${division.name}`),
  ...weightClasses.women.map((division) => `Women's ${division.name}`),
];

export const VALID_WEIGHT_DIVISIONS = validWeightDivisions as [
  string,
  ...string[],
];

export const RANKING_GENDERS = ["MALE", "FEMALE"] as const;

export type RankingGender = (typeof RANKING_GENDERS)[number];

export type RankingAssignment = {
  athleteId: string;
  rank: number;
};

export type RankingAthlete = {
  id: string;
  name: string;
  retired: boolean | null;
  weightDivision: string;
  gender: string;
};

export type ScopedAthlete = {
  id: string;
  name: string;
  rank: number;
};

export type RankChange = {
  athleteId: string;
  name: string;
  before: number;
  after: number;
};

export type RankingsQuery =
  | { ok: true; kind: "division"; weightDivision: string }
  | { ok: true; kind: "p4p"; gender: RankingGender }
  | { ok: false; error: string };

export const RANK_FIELDS_MOVED_ERROR =
  "rank and poundForPoundRank cannot be updated on this endpoint. Use PUT /api/bot/rankings/division for division rank or PUT /api/bot/rankings/p4p for pound-for-pound rank.";

const rankingEntrySchema = z.object({
  athleteId: z.string().min(1),
  rank: z.number().int(),
});

export const divisionRankingsBodySchema = z.object({
  weightDivision: z.enum(VALID_WEIGHT_DIVISIONS),
  rankings: z.array(rankingEntrySchema),
  dryRun: z.boolean().optional(),
  vacantChampion: z.boolean().optional(),
});

export const p4pRankingsBodySchema = z.object({
  gender: z.enum(RANKING_GENDERS),
  rankings: z.array(rankingEntrySchema),
  dryRun: z.boolean().optional(),
});

export function isWeightDivision(value: string): boolean {
  return (VALID_WEIGHT_DIVISIONS as readonly string[]).includes(value);
}

export function isRankingGender(value: string): value is RankingGender {
  return value === "MALE" || value === "FEMALE";
}

export function divisionStartRank(vacantChampion: boolean): number {
  return vacantChampion ? 2 : 1;
}

export function hasForbiddenRankFields(body: unknown): boolean {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return false;
  }

  return "rank" in body || "poundForPoundRank" in body;
}

export function parseRankingsQuery(params: {
  division: string | null;
  p4p: string | null;
}): RankingsQuery {
  const division = params.division;
  const p4p = params.p4p;

  if (division !== null && p4p !== null) {
    return {
      ok: false,
      error: "Provide either division or p4p, not both.",
    };
  }

  if (division === null && p4p === null) {
    return {
      ok: false,
      error: "Provide a division or p4p query parameter.",
    };
  }

  if (division !== null) {
    if (!isWeightDivision(division)) {
      return {
        ok: false,
        error: `Invalid weight division. Expected one of: ${VALID_WEIGHT_DIVISIONS.join(", ")}.`,
      };
    }

    return { ok: true, kind: "division", weightDivision: division };
  }

  const gender = (p4p ?? "").toUpperCase();
  if (!isRankingGender(gender)) {
    return {
      ok: false,
      error: "Invalid p4p gender. Expected MALE or FEMALE.",
    };
  }

  return { ok: true, kind: "p4p", gender };
}

export function validateRankingAssignments(
  rankings: RankingAssignment[],
  options: { maxRank: number; startRank: number; vacantChampion?: boolean }
): string[] {
  const errors: string[] = [];
  const maxCount = options.maxRank - options.startRank + 1;

  if (rankings.length > maxCount) {
    errors.push(`At most ${maxCount} athletes can be ranked`);
  }

  const seenIds = new Set<string>();
  const seenRanks = new Set<number>();
  let skippedRank = false;

  for (const entry of rankings) {
    if (typeof entry.athleteId !== "string" || entry.athleteId.trim() === "") {
      errors.push("Each ranking must include a non-empty athleteId");
      skippedRank = true;
      continue;
    }

    if (seenIds.has(entry.athleteId)) {
      errors.push(`Duplicate athleteId: ${entry.athleteId}`);
    }
    seenIds.add(entry.athleteId);

    if (!Number.isInteger(entry.rank)) {
      errors.push(`Rank for ${entry.athleteId} must be an integer`);
      skippedRank = true;
      continue;
    }

    if (entry.rank < options.startRank || entry.rank > options.maxRank) {
      errors.push(
        `Rank ${entry.rank} for ${entry.athleteId} must be between ${options.startRank} and ${options.maxRank}`
      );
      skippedRank = true;
      continue;
    }

    if (seenRanks.has(entry.rank)) {
      errors.push(`Duplicate rank: ${entry.rank}`);
    }
    seenRanks.add(entry.rank);
  }

  if (rankings.length > 0 && !skippedRank && seenRanks.size === rankings.length) {
    const expected: number[] = [];
    for (
      let rank = options.startRank;
      rank < options.startRank + rankings.length;
      rank += 1
    ) {
      expected.push(rank);
    }

    const contiguous = expected.every((rank) => seenRanks.has(rank));
    if (!contiguous) {
      errors.push(
        options.vacantChampion
          ? "Ranks must be unique and contiguous starting at 2 when vacantChampion is true"
          : `Ranks must be unique and contiguous starting at ${options.startRank}`
      );
    }
  }

  return errors;
}

export function validateDivisionRankingAthletes(
  rankings: RankingAssignment[],
  athletes: RankingAthlete[],
  weightDivision: string
): string[] {
  const byId = new Map(athletes.map((athlete) => [athlete.id, athlete]));
  const errors: string[] = [];

  for (const entry of rankings) {
    const athlete = byId.get(entry.athleteId);
    if (!athlete) {
      errors.push(`Athlete not found: ${entry.athleteId}`);
      continue;
    }

    if (athlete.weightDivision !== weightDivision) {
      errors.push(
        `${athlete.name} (${athlete.id}) is not in ${weightDivision}`
      );
    }

    if (athlete.retired === true) {
      errors.push(`${athlete.name} (${athlete.id}) is retired`);
    }
  }

  return errors;
}

export function validateP4pRankingAthletes(
  rankings: RankingAssignment[],
  athletes: RankingAthlete[],
  gender: RankingGender
): string[] {
  const byId = new Map(athletes.map((athlete) => [athlete.id, athlete]));
  const errors: string[] = [];

  for (const entry of rankings) {
    const athlete = byId.get(entry.athleteId);
    if (!athlete) {
      errors.push(`Athlete not found: ${entry.athleteId}`);
      continue;
    }

    if (athlete.gender !== gender) {
      errors.push(`${athlete.name} (${athlete.id}) is not ${gender}`);
    }

    if (athlete.retired === true) {
      errors.push(`${athlete.name} (${athlete.id}) is retired`);
    }
  }

  return errors;
}

export function diffRankChanges(
  scope: ScopedAthlete[],
  rankings: RankingAssignment[]
): RankChange[] {
  const assigned = new Map(
    rankings.map((entry) => [entry.athleteId, entry.rank])
  );
  const changes: RankChange[] = [];

  for (const athlete of scope) {
    const after = assigned.get(athlete.id) ?? 0;
    if (after === athlete.rank) {
      continue;
    }

    changes.push({
      athleteId: athlete.id,
      name: athlete.name,
      before: athlete.rank,
      after,
    });
  }

  changes.sort((left, right) => {
    if (left.after === 0 && right.after !== 0) {
      return 1;
    }
    if (right.after === 0 && left.after !== 0) {
      return -1;
    }
    if (left.after !== right.after) {
      return left.after - right.after;
    }
    return left.name.localeCompare(right.name);
  });

  return changes;
}
