"use server";

import prisma from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";
import { Athlete } from "@/types/athlete";

export async function getRetiredAthletes(): Promise<Athlete[]> {
  // Disable caching at the data source
  noStore();

  try {
    const athletes = await prisma.athlete.findMany({
      where: {
        retired: true,
      },
      orderBy: [{ followers: "desc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        gender: true,
        weightDivision: true,
        country: true,
        wins: true,
        losses: true,
        draws: true,
        winsByKo: true,
        winsBySubmission: true,
        followers: true,
        imageUrl: true,
        retired: true,
        age: true,
        rank: true,
      },
    });

    return athletes.map((athlete) => ({
      ...athlete,
      gender: athlete.gender as "MALE" | "FEMALE",
      retired: athlete.retired ?? false,
    }));
  } catch (error) {
    console.error("Error fetching retired athletes:", error);
    throw new Error("Failed to fetch retired athletes");
  }
}
