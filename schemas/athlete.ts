import { z } from "zod";

export const athleteSchema = z.object({
  // Basic Information
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .nonempty("Name is required"),
  gender: z.enum(["MALE", "FEMALE"], { required_error: "Gender is required" }),
  age: z.number().int().min(18).max(65).default(18),
  country: z
    .string()
    .min(2, "Country must be at least 2 characters")
    .nonempty("Country is required"),
  weightDivision: z
    .string()
    .min(2, "Weight division must be at least 2 characters")
    .nonempty("Weight division is required"),

  // Fight Record
  wins: z.number().int().min(0).default(0),
  losses: z.number().int().min(0).default(0),
  draws: z.number().int().min(0).default(0),
  winsByKo: z.number().int().min(0).default(0),
  winsBySubmission: z.number().int().min(0).default(0),

  // Rankings & Stats
  rank: z.number().int().min(0).optional(),
  poundForPoundRank: z.number().int().min(0).max(15).optional(),
  followers: z.number().int().min(0).default(0),

  // Status
  retired: z.boolean().default(false),
  imageUrl: z.string().optional(),
});
