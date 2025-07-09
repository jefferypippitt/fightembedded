"use server";

import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export const getStats = unstable_cache(
  async () => {
    const [
      activeAthletes,
      weightClasses,
      champions,
      events,
      maleP4P,
      femaleP4P,
    ] = await Promise.all([
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
          gender: "MALE",
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
          gender: "FEMALE",
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
  },
  ["stats-data", "homepage-stats"],
  {
    revalidate: 604800, // Cache for 1 week
    tags: ["stats", "homepage", "stats-data", "homepage-stats"],
  }
);
