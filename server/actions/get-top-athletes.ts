"use server";

import prisma from "@/lib/prisma";

export async function getTopAthletes() {
  return prisma.athlete.findMany({
    where: {
      wins: {
        gt: 0
      }
    },
    orderBy: [
      {
        wins: 'desc'
      }
    ],
    take: 3,
    select: {
      name: true,
      weightDivision: true,
      country: true,
      wins: true,
      losses: true,
    }
  });
} 