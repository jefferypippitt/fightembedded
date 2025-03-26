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

  // Get recently retired athletes
  const recentlyRetiredAthletes = await prisma.athlete.findMany({
    where: {
      retired: true
    },
    orderBy: {
      updatedAt: 'desc'
    },
    take: 3,
    select: {
      name: true,
      weightDivision: true,
      country: true,
      updatedAt: true,
      wins: true,
      losses: true
    }
  });

  // Format dates for recently retired athletes
  const formattedRecentlyRetiredAthletes = recentlyRetiredAthletes.map(athlete => ({
    ...athlete,
    updatedAt: athlete.updatedAt.toISOString(),
    winRate: athlete.wins + athlete.losses > 0 
      ? ((athlete.wins / (athlete.wins + athlete.losses)) * 100).toFixed(1)
      : '0.0'
  }));

  // Get pound-for-pound rankings
  const [maleP4P, femaleP4P] = await Promise.all([
    prisma.athlete.findFirst({
      where: {
        gender: 'MALE',
        retired: false,
        poundForPoundRank: 1
      },
      select: {
        name: true,
        weightDivision: true,
        country: true,
        wins: true,
        losses: true,
        poundForPoundRank: true
      }
    }),
    prisma.athlete.findFirst({
      where: {
        gender: 'FEMALE',
        retired: false,
        poundForPoundRank: 1
      },
      select: {
        name: true,
        weightDivision: true,
        country: true,
        wins: true,
        losses: true,
        poundForPoundRank: true
      }
    })
  ]);

  // Format pound-for-pound rankings with win rates
  const poundForPoundRankings = {
    male: maleP4P ? {
      ...maleP4P,
      winRate: maleP4P.wins + maleP4P.losses > 0 
        ? ((maleP4P.wins / (maleP4P.wins + maleP4P.losses)) * 100).toFixed(1)
        : '0.0'
    } : null,
    female: femaleP4P ? {
      ...femaleP4P,
      winRate: femaleP4P.wins + femaleP4P.losses > 0 
        ? ((femaleP4P.wins / (femaleP4P.wins + femaleP4P.losses)) * 100).toFixed(1)
        : '0.0'
    } : null
  };

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
    poundForPoundRankings,
    recentAthletes: formattedRecentAthletes,
    recentlyRetiredAthletes: formattedRecentlyRetiredAthletes
  };
}