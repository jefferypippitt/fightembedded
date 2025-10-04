"use server";

import prisma from "@/lib/prisma";
import { cache } from "react";

export const getCountryStats = cache(async () => {
  // Cached - only revalidates when revalidatePath() is called

  const countries = await prisma.athlete.groupBy({
    by: ["country"],
    _count: {
      country: true,
    },
    orderBy: {
      _count: {
        country: "desc",
      },
    },
    take: 3,
  });

  return countries.map((country) => ({
    country: country.country,
    count: country._count.country,
    trend: "up", // You might want to calculate this based on historical data
  }));
});
