"use server";

import prisma from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

export interface PopularityAthlete {
  id: string;
  name: string;
  followers: number;
  gender: string;
}

export async function getAllAthletesPopularity(): Promise<{
  maleAthletes: PopularityAthlete[];
  femaleAthletes: PopularityAthlete[];
}> {
  "use cache";
  cacheLife("days");
  cacheTag("all-athletes-popularity");
  cacheTag("top-20-athletes"); // shared tag — already revalidated by all athlete mutations

  try {
    const [maleAthletes, femaleAthletes] = await Promise.all([
      prisma.athlete.findMany({
        where: {
          gender: "MALE",
          followers: { gt: 0 },
        },
        orderBy: { followers: "desc" },
        select: {
          id: true,
          name: true,
          followers: true,
          gender: true,
        },
      }),
      prisma.athlete.findMany({
        where: {
          gender: "FEMALE",
          followers: { gt: 0 },
        },
        orderBy: { followers: "desc" },
        select: {
          id: true,
          name: true,
          followers: true,
          gender: true,
        },
      }),
    ]);

    return { maleAthletes, femaleAthletes };
  } catch (error) {
    console.error("Error fetching all athletes popularity:", error);
    throw new Error("Failed to fetch all athletes popularity");
  }
}
