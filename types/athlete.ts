import { z } from "zod";
import { athleteSchema } from "@/schemas/athlete";
import { Athlete } from "@prisma/client";

export type AthleteInput = z.infer<typeof athleteSchema>;

export type ActionResponse = {
  status: "success" | "error";
  message: string;
  data?: Athlete;
}; 