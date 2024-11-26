import prisma from "@/lib/prisma";
import { Athlete } from "@prisma/client";

export async function getAthletes(): Promise<Athlete[]> {
  return await prisma.athlete.findMany();
} 