import prisma from "@/lib/prisma";

export async function getDashboardStats() {
  // Get recent athletes with formatted date
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

  // Format dates for recent athletes
  const formattedRecentAthletes = recentAthletes.map(athlete => ({
    ...athlete,
    createdAt: athlete.createdAt.toISOString() // Convert Date to ISO string for serialization
  }));

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
    },
    orderBy: {
      wins: 'desc'
    }
  });

  const athletesWithWinRate = athletesWithStats
    .map(athlete => ({
      ...athlete,
      winRate: athlete.wins + athlete.losses > 0 
        ? ((athlete.wins / (athlete.wins + athlete.losses)) * 100).toFixed(1)
        : '0.0'
    }))
    .sort((a, b) => parseFloat(b.winRate) - parseFloat(a.winRate))
    .slice(0, 9);

  const [totalAthletes, divisionStats] = await Promise.all([
    prisma.athlete.count(),
    
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

  const divisionStatsWithPercentage = divisionStats.map(division => ({
    division: division.weightDivision,
    count: division._count._all,
    percentage: ((division._count._all / totalAthletes) * 100).toFixed(2),
  }));

  return {
    totalAthletes: {
      value: totalAthletes,
    },
    divisionStats: divisionStatsWithPercentage,
    topAthletes: athletesWithWinRate,
    recentAthletes: formattedRecentAthletes
  };
}