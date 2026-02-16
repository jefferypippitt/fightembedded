"use server";

import prisma from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

export interface Athlete {
  id: string;
  name: string;
  followers: number;
  gender: string;
}

export async function getTop20Athletes() {
  "use cache";
  cacheLife("days");
  cacheTag("top-20-athletes");

  try {
    const [maleAthletes, femaleAthletes] = await Promise.all([
      prisma.athlete.findMany({
        where: {
          AND: [{ gender: "MALE" }, { retired: false }, { followers: { gt: 0 } }],
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
      }),
      prisma.athlete.findMany({
        where: {
          AND: [
            { gender: "FEMALE" },
            { retired: false },
            { followers: { gt: 0 } },
          ],
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
      }),
    ]);

    return {
      maleAthletes,
      femaleAthletes,
    };
  } catch (error) {
    console.error("Error fetching top athletes:", error);
    throw new Error("Failed to fetch top athletes");
  }
}
