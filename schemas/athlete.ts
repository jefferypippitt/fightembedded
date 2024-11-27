import { z } from "zod";

export const athleteSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .nonempty("Name is required"),
  gender: z.enum(["MALE", "FEMALE"], { required_error: "Gender is required" }),
  age: z.number().int().min(18).max(65).default(18),
  weightDivision: z
    .string()
    .min(2, "Weight division must be at least 2 characters")
    .nonempty("Weight division is required"),
  country: z
    .string()
    .min(2, "Country must be at least 2 characters")
    .nonempty("Country is required"),
  wins: z.number().int().min(0).default(0),
  losses: z.number().int().min(0).default(0),
  draws: z.number().int().min(0).default(0),
  winsByKo: z.coerce.number().min(0).default(0),
  winsBySubmission: z.coerce.number().min(0).default(0),
  followers: z.number().int().min(0).default(0),
  rank: z.coerce.number().int().min(0).default(0),
  poundForPoundRank: z.coerce.number().int().min(0).max(15).default(0),
  imageUrl: z.string().optional(),
});
