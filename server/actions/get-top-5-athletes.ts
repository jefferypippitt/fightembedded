"use server";

import prisma from "@/lib/prisma";
import { cache } from "react";

export interface DivisionRankings {
  division: string;
  athletes: {
    id: string;
    name: string;
    followers: number;
    rank: number;
  }[];
}

// Cache the function per request - prevents refetching on same request
export const getTop5Athletes = cache(async () => {
  try {
    const divisions = await prisma.athlete.findMany({
      where: {
        AND: [
          { rank: { gt: 0 } },
          { rank: { lte: 5 } },
          { retired: false }, // Only active athletes
        ],
      },
      distinct: ["weightDivision"],
      select: {
        weightDivision: true,
      },
    });

    const rankings = await Promise.all(
      divisions.map(async ({ weightDivision }) => {
        // Group all female divisions under "Women's X" and include both 'X' and 'Women's X' athletes
        const femaleDivisions = ["Bantamweight", "Flyweight", "Strawweight"];
        const isFemaleDivision = femaleDivisions.some(
          (d) => weightDivision === d || weightDivision === `Women's ${d}`
        );
        let divisionKey = weightDivision;
        let divisionWhere: Record<string, unknown> = { weightDivision };
        if (isFemaleDivision) {
          const base = weightDivision.replace("Women's ", "");
          divisionKey = `Women's ${base}`;
          divisionWhere = {
            OR: [
              { weightDivision: base },
              { weightDivision: `Women's ${base}` },
            ],
          };
        }

        const athletes = await prisma.athlete.findMany({
          where: {
            ...divisionWhere,
            AND: [
              { rank: { gt: 0 } },
              { rank: { lte: 5 } },
              { retired: false },
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
          division: divisionKey,
          athletes: athletes.map((athlete) => ({
            ...athlete,
            rank: athlete.rank ?? 0,
          })),
        };
      })
    );

    // Filter out any divisions that don't have any ranked athletes
    return rankings.filter((division) => division.athletes.length > 0);
  } catch (error) {
    console.error("Error fetching top 5 athletes:", error);
    throw new Error("Failed to fetch top 5 athletes");
  }
});
