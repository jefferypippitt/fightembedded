"use server";

import prisma from "@/lib/prisma";

export async function getDashboardStats() {
  const currentDate = new Date();
  const lastMonthDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));

  // Get recent athletes
  const recentAthletes = await prisma.athlete.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    take: 3,
    select: {
      name: true,
      weightDivision: true,
      country: true,
      createdAt: true
    }
  });

  // Get all athletes with wins and losses for win rate calculation
  const athletesWithStats = await prisma.athlete.findMany({
    where: {
      OR: [
        { wins: { gt: 0 } },
        { losses: { gt: 0 } }
      ]
    },
    select: {
      name: true,
      weightDivision: true,
      country: true,
      wins: true,
      losses: true,
    }
  });

  const athletesWithWinRate = athletesWithStats
    .map(athlete => ({
      ...athlete,
      winRate: athlete.wins + athlete.losses > 0 
        ? (athlete.wins / (athlete.wins + athlete.losses)) * 100 
        : 0
    }))
    .sort((a, b) => b.winRate - a.winRate)
    .slice(0, 9)
    .map(athlete => ({
      ...athlete,
      winRate: athlete.winRate.toFixed(1)
    }));

  const [totalAthletes, lastMonthAthletes, divisionStats] = await Promise.all([
    prisma.athlete.count(),
    
    prisma.athlete.count({
      where: {
        createdAt: {
          lt: lastMonthDate
        }
      }
    }),

    prisma.athlete.groupBy({
      by: ['weightDivision'],
      _count: {
        _all: true,
      },
      orderBy: {
        _count: {
          weightDivision: 'desc'
        }
      }
    })
  ]);

  const athletesChange = lastMonthAthletes ? 
    ((totalAthletes - lastMonthAthletes) / lastMonthAthletes * 100).toFixed(1) :
    "0";

  const divisionStatsWithPercentage = divisionStats.map(division => ({
    division: division.weightDivision,
    count: division._count._all,
    percentage: ((division._count._all / totalAthletes) * 100).toFixed(2),
  }));

  const newAthletesThisMonth = await prisma.athlete.count({
    where: {
      createdAt: {
        gte: lastMonthDate
      }
    }
  });

  return {
    totalAthletes: {
      value: totalAthletes,
      change: `${athletesChange}%`,
      trend: parseFloat(athletesChange) >= 0 ? "up" : "down"
    },
    newAthletes: {
      value: newAthletesThisMonth,
      change: `${((newAthletesThisMonth / (totalAthletes - newAthletesThisMonth)) * 100).toFixed(1)}%`,
      trend: "up"
    },
    divisionStats: divisionStatsWithPercentage,
    topAthletes: athletesWithWinRate,
    recentAthletes: recentAthletes
  };
}