"use server";

import prisma from "@/lib/prisma";
import { cache } from "react";

export const getStats = cache(async () => {
  // Cached - only revalidates when revalidatePath() is called

  const [activeAthletes, weightClasses, champions, events, maleP4P, femaleP4P] =
    await Promise.all([
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
});

// Live stats function for hero section
export const getLiveStats = cache(async () => {
  // Cached - only revalidates when revalidatePath() is called

  const [
    totalAthletes,
    activeAthletes,
    retiredAthletes,
    totalEvents,
    maleP4P,
    femaleP4P,
  ] = await Promise.all([
    // Count total athletes (active + retired)
    prisma.athlete.count(),

    // Count active athletes only
    prisma.athlete.count({
      where: {
        retired: false,
      },
    }),

    // Count retired athletes only
    prisma.athlete.count({
      where: {
        retired: true,
      },
    }),

    // Count total events
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
    totalAthletes,
    activeAthletes,
    retiredAthletes,
    totalEvents,
    poundForPoundRankings: {
      male: maleP4P,
      female: femaleP4P,
    },
  };
});
