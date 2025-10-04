"use server";

import prisma from "@/lib/prisma";
import { cache } from "react";

export const getDashboardStats = cache(async () => {
  // Cached - only revalidates when revalidatePath() is called

  // Get the start of the current week (Monday)
  const now = new Date();
  const startOfWeek = new Date(now);
  const dayOfWeek = now.getDay();
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Sunday = 0, so subtract 6 to get to Monday
  startOfWeek.setDate(now.getDate() - daysToSubtract);
  startOfWeek.setHours(0, 0, 0, 0);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Get all required data in parallel
  const [
    recentAthletes,
    recentlyRetiredAthletes,
    totalAthletes,
    maleP4P,
    femaleP4P,
    upcomingEvents,
    totalEvents,
    topCountries,
    mostFollowedAthlete,
    totalChampions,
  ] = await Promise.all([
    // Recent athletes (added this week)
    prisma.athlete.findMany({
      where: {
        createdAt: {
          gte: startOfWeek,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        name: true,
        weightDivision: true,
        country: true,
        createdAt: true,
      },
    }),

    // Recently retired athletes
    prisma.athlete.findMany({
      where: {
        retired: true,
        updatedAt: {
          gte: thirtyDaysAgo,
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        name: true,
        weightDivision: true,
        country: true,
        updatedAt: true,
        wins: true,
        losses: true,
      },
    }),

    // Total athletes (including retired)
    prisma.athlete.count(),

    // Male P4P #1
    prisma.athlete.findFirst({
      where: {
        gender: "MALE",
        retired: false,
        poundForPoundRank: 1,
      },
      select: {
        name: true,
        weightDivision: true,
        country: true,
        wins: true,
        losses: true,
        poundForPoundRank: true,
      },
    }),

    // Female P4P #1
    prisma.athlete.findFirst({
      where: {
        gender: "FEMALE",
        retired: false,
        poundForPoundRank: 1,
      },
      select: {
        name: true,
        weightDivision: true,
        country: true,
        wins: true,
        losses: true,
        poundForPoundRank: true,
      },
    }),

    // Upcoming events
    prisma.event.findMany({
      where: {
        status: "UPCOMING",
      },
      orderBy: {
        date: "asc",
      },
      select: {
        name: true,
        date: true,
        venue: true,
        location: true,
      },
    }),

    // Total events (past and upcoming)
    prisma.event.count(),

    // Top three countries by number of athletes
    prisma.athlete.groupBy({
      by: ["country"],
      where: {
        retired: false,
      },
      _count: {
        country: true,
      },
      orderBy: {
        _count: {
          country: "desc",
        },
      },
      take: 3,
    }),

    // Most followed athlete
    prisma.athlete.findFirst({
      where: {
        retired: false,
      },
      orderBy: {
        followers: "desc",
      },
      select: {
        name: true,
        weightDivision: true,
        country: true,
        followers: true,
        wins: true,
        losses: true,
      },
    }),

    // Add new query for total champions
    prisma.athlete.count({
      where: {
        rank: 1,
        retired: false,
      },
    }),
  ]);

  // Format dates for recent athletes
  const formattedRecentAthletes = recentAthletes.map((athlete) => ({
    ...athlete,
    createdAt: athlete.createdAt.toISOString(),
  }));

  // Format dates for recently retired athletes
  const formattedRecentlyRetiredAthletes = recentlyRetiredAthletes.map(
    (athlete) => ({
      ...athlete,
      updatedAt: athlete.updatedAt.toISOString(),
      winRate:
        athlete.wins + athlete.losses > 0
          ? ((athlete.wins / (athlete.wins + athlete.losses)) * 100).toFixed(1)
          : "0.0",
    })
  );

  // Format pound-for-pound rankings with win rates
  const poundForPoundRankings = {
    male: maleP4P
      ? {
          ...maleP4P,
          winRate:
            maleP4P.wins + maleP4P.losses > 0
              ? (
                  (maleP4P.wins / (maleP4P.wins + maleP4P.losses)) *
                  100
                ).toFixed(1)
              : "0.0",
        }
      : null,
    female: femaleP4P
      ? {
          ...femaleP4P,
          winRate:
            femaleP4P.wins + femaleP4P.losses > 0
              ? (
                  (femaleP4P.wins / (femaleP4P.wins + femaleP4P.losses)) *
                  100
                ).toFixed(1)
              : "0.0",
        }
      : null,
  };

  // Format upcoming events
  const formattedUpcomingEvents = upcomingEvents.map((event) => ({
    ...event,
    date: event.date.toISOString(),
  }));

  // Format most followed athlete
  const formattedMostFollowedAthlete = mostFollowedAthlete
    ? {
        ...mostFollowedAthlete,
        winRate:
          mostFollowedAthlete.wins + mostFollowedAthlete.losses > 0
            ? (
                (mostFollowedAthlete.wins /
                  (mostFollowedAthlete.wins + mostFollowedAthlete.losses)) *
                100
              ).toFixed(1)
            : "0.0",
      }
    : null;

  return {
    totalAthletes: {
      value: totalAthletes,
    },
    recentAthletes: formattedRecentAthletes,
    recentlyRetiredAthletes: formattedRecentlyRetiredAthletes,
    poundForPoundRankings,
    upcomingEvents: formattedUpcomingEvents,
    totalEvents,
    topCountries: topCountries.map((country) => ({
      country: country.country,
      count: country._count.country,
    })),
    totalChampions,
    mostFollowedAthlete: formattedMostFollowedAthlete,
  };
});
