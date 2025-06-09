"use server";

import prisma from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";

export async function getStats() {
  // Disable caching at the data source
  noStore();

  const [activeAthletes, weightClasses, champions, events, maleP4P, femaleP4P] = await Promise.all([
    // Count all athletes
    prisma.athlete.count(),

    // Count unique weight divisions
    prisma.athlete
      .groupBy({
        by: ["weightDivision"],
      })
      .then((divisions) => divisions.length),

    // Count champions (athletes with rank 1)
    prisma.athlete.count({
      where: {
        rank: 1,
      },
    }),

    // Count events
    prisma.event.count(),

    // Get male pound-for-pound rankings
    prisma.athlete.findMany({
      where: {
        gender: "male",
        poundForPoundRank: {
          gt: 0,
        },
      },
      orderBy: {
        poundForPoundRank: "asc",
      },
      take: 3,
      select: {
        id: true,
        name: true,
        poundForPoundRank: true,
        weightDivision: true,
      },
    }),

    // Get female pound-for-pound rankings
    prisma.athlete.findMany({
      where: {
        gender: "female",
        poundForPoundRank: {
          gt: 0,
        },
      },
      orderBy: {
        poundForPoundRank: "asc",
      },
      take: 3,
      select: {
        id: true,
        name: true,
        poundForPoundRank: true,
        weightDivision: true,
      },
    }),
  ]);

  return {
    activeAthletes,
    weightClasses,
    champions,
    events,
    poundForPoundRankings: {
      male: maleP4P,
      female: femaleP4P,
    },
  };
}
