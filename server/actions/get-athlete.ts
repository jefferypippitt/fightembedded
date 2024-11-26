"use server";

import prisma from "@/lib/prisma";
import { Athlete } from "@prisma/client";

export async function getAthletesByDivision(
  divisionName: string
): Promise<Athlete[]> {
  try {
    const athletes = await prisma.athlete.findMany({
      where: {
        weightDivision: {
          equals: divisionName,
          mode: 'insensitive',
        },
      },
    });

    console.log('Athletes found for division:', divisionName, athletes);
    return athletes;
  } catch (error) {
    console.error("Error fetching athletes:", error);
    throw new Error("Failed to fetch athletes");
  }
}

export async function getAthlete(id: string) {
  try {
    const athlete = await prisma.athlete.findUnique({
      where: { id }
    });
    return athlete;
  } catch (error) {
    console.error("Error fetching athlete:", error);
    throw new Error("Failed to fetch athlete");
  }
}
