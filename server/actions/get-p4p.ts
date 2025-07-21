"use server";

import prisma from "@/lib/prisma";
import { unstable_cache, unstable_noStore as noStore } from "next/cache";
import { revalidateTag } from "next/cache";

export const getP4PRankings = unstable_cache(
  async () => {
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
  },
  ["p4p-rankings-data", "homepage-p4p"],
  {
    tags: ["p4p-rankings", "p4p-rankings-data", "homepage-p4p", "athletes"], // More specific tags
  }
);

// Live P4P rankings function for homepage
export const getLiveP4PRankings = async () => {
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
};

// Function to revalidate the cache
export async function revalidateP4PRankings() {
  revalidateTag("p4p-rankings");
  revalidateTag("homepage");
  revalidateTag("athletes");
}
