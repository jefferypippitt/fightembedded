"use server";

import prisma from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";

export async function getP4PRankings() {
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
}

// Live P4P rankings function for homepage
export async function getLiveP4PRankings() {
  // Disable caching to ensure fresh data
  noStore();

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
}
