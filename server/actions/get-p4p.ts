"use server";

import prisma from "@/lib/prisma";

export async function getP4PRankings() {
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
}
