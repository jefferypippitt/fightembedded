"use server";

import prisma from "@/lib/prisma";

export async function getChampions() {
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
}
