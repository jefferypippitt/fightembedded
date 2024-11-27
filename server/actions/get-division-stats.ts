"use server";

import prisma from "@/lib/prisma";

export async function getDivisionStats() {
  const divisions = await prisma.athlete.groupBy({
    by: ['weightDivision'],
    _count: {
      weightDivision: true
    },
    orderBy: {
      _count: {
        weightDivision: 'desc'
      }
    },
    take: 3,
  });

  const total = divisions.reduce((acc, curr) => acc + curr._count.weightDivision, 0);

  return divisions.map(div => ({
    division: div.weightDivision,
    count: div._count.weightDivision,
    percentage: Math.round((div._count.weightDivision / total) * 100)
  }));
} 