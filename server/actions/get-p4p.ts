"use server";

import prisma from "@/lib/prisma";
import { unstable_cache } from 'next/cache';

export const getP4PRankings = unstable_cache(
  async () => {
    const maleP4PRankings = await prisma.athlete.findMany({
      where: {
        gender: "MALE",
        poundForPoundRank: {
          gte: 1,
          lte: 15,
        },
      },
      orderBy: {
        poundForPoundRank: "asc",
      },
    });

    const femaleP4PRankings = await prisma.athlete.findMany({
      where: {
        gender: "FEMALE",
        poundForPoundRank: {
          gte: 1,
          lte: 15,
        },
      },
      orderBy: {
        poundForPoundRank: "asc",
      },
    });

    return {
      maleP4PRankings,
      femaleP4PRankings,
    };
  },
  ['p4p-rankings', 'homepage'],
  { 
    revalidate: 604800, // Cache for a week (7 days)
    tags: ['p4p-rankings', 'homepage', 'athletes'] // Tags for cache invalidation
  }
);
