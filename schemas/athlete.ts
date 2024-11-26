import { z } from "zod";

export const athleteSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),

  gender: z.enum(["MALE", "FEMALE"], { required_error: "Gender is required" }),

  age: z.number().int().min(18).max(65),


  rank: z.number().int().min(0).optional(),

  poundForPoundRank: z.number().int().min(0).max(15).optional(),

  weightDivision: z
    .string()
    .min(2, "Weight division must be at least 2 characters"),

  country: z.string().min(2, "Country must be at least 2 characters"),

  wins: z.number().int().min(0).default(0),

  losses: z.number().int().min(0).default(0),

  draws: z.number().int().min(0).default(0),

  koRate: z
    .number()
    .min(0)
    .max(100)
    .default(0)
    .describe("Number of wins by knockout"),

  submissionRate: z
    .number()
    .min(0)
    .max(100)
    .default(0)
    .describe("Number of wins by submission"),

  followers: z.number().int().min(0).default(0),

  imageUrl: z.string().optional(),
});
