"use server";

import prisma from "@/lib/prisma";

export async function getDashboardStats() {
  // Get total athletes count and calculate month-over-month change
  const totalAthletes = await prisma.athlete.count();
  const lastMonthAthletes = await prisma.athlete.count({
    where: {
      createdAt: {
        lt: new Date(new Date().setMonth(new Date().getMonth() - 1))
      }
    }
  });
  
  const athletesChange = lastMonthAthletes ? 
    ((totalAthletes - lastMonthAthletes) / lastMonthAthletes * 100).toFixed(1) :
    "0";

  return {
    totalAthletes: {
      value: totalAthletes,
      change: `${athletesChange}%`,
    }
  };
} 