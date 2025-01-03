"use server";

import prisma from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";

export async function getStats() {
  // Disable caching at the data source
  noStore();

  const [activeAthletes, weightClasses, champions, events] = await Promise.all([
    // Count all athletes
    prisma.athlete.count(),

    // Count unique weight divisions
    prisma.athlete
      .groupBy({
        by: ["weightDivision"],
      })
      .then((divisions) => divisions.length),

    // Count champions (athletes with rank 1)
    prisma.athlete.count({
      where: {
        rank: 1,
      },
    }),

    // Count events
    prisma.event.count(),
  ]);

  return {
    activeAthletes,
    weightClasses,
    champions,
    events,
  };
}
