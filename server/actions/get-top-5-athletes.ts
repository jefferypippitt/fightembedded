"use server";

import prisma from "@/lib/prisma";

export interface DivisionRankings {
  division: string;
  athletes: {
    id: string;
    name: string;
    followers: number;
    rank: number;
  }[];
}

export async function getTop5Athletes(): Promise<DivisionRankings[]> {
  try {
    const divisions = await prisma.athlete.findMany({
      where: {
        AND: [{ rank: { gt: 0 } }, { rank: { lte: 5 } }],
      },
      distinct: ["weightDivision"],
      select: {
        weightDivision: true,
      },
    });

    const rankings = await Promise.all(
      divisions.map(async ({ weightDivision }) => {
        const athletes = await prisma.athlete.findMany({
          where: {
            weightDivision,
            AND: [
              { rank: { gt: 0 } }, // Filter out rank 0 (unranked)
              { rank: { lte: 5 } }, // Only include ranks 1-5
            ],
          },
          orderBy: {
            rank: "asc",
          },
          select: {
            id: true,
            name: true,
            followers: true,
            rank: true,
          },
          take: 5,
        });

        return {
          division: weightDivision,
          athletes,
        };
      })
    );

    // Filter out any divisions that don't have any ranked athletes
    return rankings.filter((division) => division.athletes.length > 0);
  } catch (error) {
    console.error("Error fetching top 5 athletes:", error);
    throw new Error("Failed to fetch top 5 athletes");
  }
}
