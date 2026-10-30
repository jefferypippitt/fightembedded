import { z } from "zod";
import { VALID_WEIGHT_DIVISIONS } from "@/lib/rankings";

export const ATHLETE_GENDERS = ["MALE", "FEMALE"] as const;

export type AthleteGender = (typeof ATHLETE_GENDERS)[number];

export const DIVISION_GENDER_MISMATCH_ERROR =
  "weightDivision must match gender: MALE athletes use Men's divisions and FEMALE athletes use Women's divisions.";

export const RANK_FIELDS_ON_CREATE_ERROR =
  "rank and poundForPoundRank cannot be set when creating an athlete. New athletes start unranked. Use PUT /api/bot/rankings/division for division rank or PUT /api/bot/rankings/p4p for pound-for-pound rank.";

export function divisionMatchesGender(
  gender: string,
  weightDivision: string
): boolean {
  if (gender === "MALE") return weightDivision.startsWith("Men's ");
  if (gender === "FEMALE") return weightDivision.startsWith("Women's ");
  return false;
}

export function isRankedAthlete(athlete: {
  rank: number;
  poundForPoundRank: number;
}): boolean {
  return athlete.rank > 0 || athlete.poundForPoundRank > 0;
}

const count = z.number().int().nonnegative();
const imageUrl = z.string().url("Must be a valid URL").or(z.literal(""));

export const botAthleteCreateSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    gender: z.enum(ATHLETE_GENDERS),
    weightDivision: z.enum(VALID_WEIGHT_DIVISIONS),
    country: z.string().trim().min(2, "Country must be at least 2 characters"),
    age: z.number().int().positive(),
    wins: count.default(0),
    losses: count.default(0),
    draws: count.default(0),
    winsByKo: count.default(0),
    winsBySubmission: count.default(0),
    followers: count.default(0),
    retired: z.boolean().default(false),
    imageUrl: imageUrl.default(""),
  })
  .refine((data) => divisionMatchesGender(data.gender, data.weightDivision), {
    message: DIVISION_GENDER_MISMATCH_ERROR,
    path: ["weightDivision"],
  })
  .refine((data) => data.winsByKo + data.winsBySubmission <= data.wins, {
    message: "KO and submission wins cannot exceed total wins",
    path: ["winsByKo"],
  });

export const botAthleteUpdateSchema = z
  .object({
    // Stats fields
    wins: count.optional(),
    losses: count.optional(),
    draws: count.optional(),
    winsByKo: count.optional(),
    winsBySubmission: count.optional(),
    followers: count.optional(),
    // Profile fields
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .optional(),
    gender: z.enum(ATHLETE_GENDERS).optional(),
    country: z
      .string()
      .trim()
      .min(2, "Country must be at least 2 characters")
      .optional(),
    imageUrl: imageUrl.optional(),
    // Other updatable fields
    age: z.number().int().positive().optional(),
    weightDivision: z.enum(VALID_WEIGHT_DIVISIONS).optional(),
    retired: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type BotAthleteUpdate = z.infer<typeof botAthleteUpdateSchema>;
