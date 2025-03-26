import { z } from "zod";
import { athleteSchema } from "@/schemas/athlete";

export type AthleteInput = z.infer<typeof athleteSchema>;

export type ActionResponse = {
  status: "success" | "error";
  message: string;
  data?: Athlete;
};

export interface Athlete {
  id: string;
  name: string;
  imageUrl: string | null;
  country: string;
  wins: number;
  losses: number;
  draws: number;
  winsByKo: number;
  winsBySubmission: number;
  rank?: number;
  poundForPoundRank?: number;
  followers: number;
  age: number;
  retired: boolean | null;
  weightDivision: string;
  gender: string;
  createdAt: Date;
  updatedAt: Date;
}
