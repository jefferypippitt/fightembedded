import { z } from "zod";
import { athleteSchema } from "@/schemas/athlete";


export type AthleteInput = z.infer<typeof athleteSchema>;

export type ActionResponse = {
  status: "success" | "error";
  message: string;
  data?: Athlete;
};

export interface Athlete {
  id: string
  name: string
  weightDivision: string
  country: string
  wins: number
  losses: number
  draws: number
  winsByKo: number
  winsBySubmission: number
} 