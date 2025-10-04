"use server";

import prisma from "@/lib/prisma";
import { cache } from "react";

export const getP4PRankings = cache(async () => {
  // Cached - only revalidates when revalidatePath() is called

  const maleP4PRankings = await prisma.athlete.findMany({
    where: {
      gender: "MALE",
      retired: false,
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
      retired: false,
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
});

// Live P4P rankings function for homepage
export const getLiveP4PRankings = cache(async () => {
  // Cached - only revalidates when revalidatePath() is called

  const maleP4PRankings = await prisma.athlete.findMany({
    where: {
      gender: "MALE",
      retired: false,
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
      retired: false,
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
});
