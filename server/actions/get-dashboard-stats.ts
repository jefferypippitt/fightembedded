import prisma from "@/lib/prisma";

export async function getDashboardStats() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Get recent athletes from the last 30 days
  const recentAthletes = await prisma.athlete.findMany({
    where: {
      createdAt: {
        gte: thirtyDaysAgo
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
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
    createdAt: athlete.createdAt.toISOString()
  }));

  // Get recently retired athletes from the last 30 days
  const recentlyRetiredAthletes = await prisma.athlete.findMany({
    where: {
      retired: true,
      updatedAt: {
        gte: thirtyDaysAgo
      }
    },
    orderBy: {
      updatedAt: 'desc'
    },
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

  // Get total athletes count
  const totalAthletes = await prisma.athlete.count({
    where: {
      retired: false
    }
  });

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

  return {
    totalAthletes: {
      value: totalAthletes
    },
    recentAthletes: formattedRecentAthletes,
    recentlyRetiredAthletes: formattedRecentlyRetiredAthletes,
    poundForPoundRankings
  };
}