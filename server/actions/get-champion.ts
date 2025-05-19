"use server";

import prisma from "@/lib/prisma";
import { unstable_cache } from 'next/cache';

export const getChampions = unstable_cache(
  async () => {
    const champions = await prisma.athlete.findMany({
      where: {
        rank: 1,
      },
    });

    const maleChampions = champions.filter(
      (champion) => champion.gender === "MALE"
    );
    const femaleChampions = champions.filter(
      (champion) => champion.gender === "FEMALE"
    );

    return {
      maleChampions,
      femaleChampions,
    };
  },
  ['champions'],
  { revalidate: 86400 } // Revalidate every day, since champions don't change frequently
);
