"use server";

import prisma from "@/lib/prisma";

export async function getP4PRankings() {
  try {
    const maleP4PRankings = await prisma.athlete.findMany({
      where: { 
        gender: 'MALE',
        poundForPoundRank: {
          lte: 15,
          gt: 0
        }
      },
      orderBy: {
        poundForPoundRank: 'asc'
      },
      take: 15
    });

    const femaleP4PRankings = await prisma.athlete.findMany({
      where: { 
        gender: 'FEMALE',
        poundForPoundRank: {
          lte: 15,
          gt: 0
        }
      },
      orderBy: {
        poundForPoundRank: 'asc'
      },
      take: 15
    });

    return { maleP4PRankings, femaleP4PRankings };
  } catch (error) {
    console.error("Error fetching P4P rankings:", error);
    return { maleP4PRankings: [], femaleP4PRankings: [] };
  }
}
