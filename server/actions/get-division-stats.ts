"use server";

import prisma from "@/lib/prisma";
import { getAllDivisions } from "@/data/weight-class";
import { cache } from "react";

export const getDivisionStats = cache(async () => {
  // Cached - only revalidates when revalidatePath() is called

  // Get all divisions
  const divisions = getAllDivisions();

  // Get athlete counts by division
  const athletes = await prisma.athlete.findMany({
    where: {
      retired: false,
    },
    select: {
      weightDivision: true,
      gender: true,
      createdAt: true,
    },
  });

  // Create a map of division stats
  const divisionStats = divisions.map((division) => {
    // Get gender from slug (men-heavyweight or women-bantamweight)
    const isWomen = division.slug.startsWith("women-");
    const divisionGender = isWomen ? "FEMALE" : "MALE";

    // Count athletes for this division
    const divisionAthletes = athletes.filter((athlete) => {
      const isCorrectDivision =
        athlete.weightDivision.toLowerCase() === division.name.toLowerCase();
      const isCorrectGender = athlete.gender === divisionGender;
      return isCorrectDivision && isCorrectGender;
    });

    // Create monthly data
    const monthlyData: { date: string; count: number }[] = [];
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);

    // Initialize monthly counts
    for (
      let d = new Date(sixMonthsAgo);
      d <= now;
      d.setMonth(d.getMonth() + 1)
    ) {
      const monthStr = d.toISOString().slice(0, 7); // YYYY-MM format
      const count = divisionAthletes.filter(
        (athlete) => athlete.createdAt.toISOString().slice(0, 7) <= monthStr
      ).length;

      monthlyData.push({
        date: monthStr,
        count,
      });
    }

    return {
      name: division.name,
      slug: division.slug,
      data: monthlyData,
    };
  });

  return divisionStats;
});
