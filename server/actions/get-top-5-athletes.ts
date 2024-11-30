// 1. First, create the server action file (app/server/actions/get-top-5-athletes.ts)
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
            rank: {
              lte: 5,
              not: undefined,
            },
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

    return rankings.filter((division) => division.athletes.length > 0);
  } catch (error) {
    console.error("Error fetching top 5 athletes:", error);
    throw new Error("Failed to fetch top 5 athletes");
  }
}
