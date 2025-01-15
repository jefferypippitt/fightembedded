"use server";

import prisma from "@/lib/prisma";

export interface Athlete {
  id: string;
  name: string;
  followers: number;
  gender: string;
}

export async function getTop20Athletes(): Promise<{
  maleAthletes: Athlete[];
  femaleAthletes: Athlete[];
}> {
  try {
    // Fetch top 20 male athletes
    const maleAthletes = await prisma.athlete.findMany({
      where: {
        gender: "MALE",
        retired: false,
      },
      orderBy: {
        followers: "desc",
      },
      select: {
        id: true,
        name: true,
        followers: true,
        gender: true,
      },
      take: 20,
    });

    // Fetch top 20 female athletes
    const femaleAthletes = await prisma.athlete.findMany({
      where: {
        gender: "FEMALE",
        retired: false,
      },
      orderBy: {
        followers: "desc",
      },
      select: {
        id: true,
        name: true,
        followers: true,
        gender: true,
      },
      take: 20,
    });

    return {
      maleAthletes,
      femaleAthletes,
    };
  } catch (error) {
    console.error("Error fetching top athletes:", error);
    throw new Error("Failed to fetch top athletes");
  }
}
