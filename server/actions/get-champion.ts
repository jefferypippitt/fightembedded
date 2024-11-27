"use server";

import prisma from "@/lib/prisma";

const defaultChampion = {
  name: "No Champion",
  rank: 0,
  wins: 0,
  losses: 0,
  draws: 0,
  imageUrl: "/images/default-avatar.png",
  country: "",
  weightDivision: "",
  poundForPoundRank: 0,
  record: "0-0-0",
  winRate: 0,
  p4pRank: 0,
  koRate: 0,
  submissionRate: 0,
};

export async function getChampions() {
  try {
    const [menChampion, womenChampion] = await Promise.all([
      prisma.athlete.findFirst({
        where: {
          gender: "MALE",
          rank: 1,
        },
        select: {
          name: true,
          rank: true,
          wins: true,
          losses: true,
          draws: true,
          imageUrl: true,
          country: true,
          poundForPoundRank: true,
          weightDivision: true,
          winsByKo: true,
          winsBySubmission: true,
        },
      }),
      prisma.athlete.findFirst({
        where: {
          gender: "FEMALE",
          rank: 1,
        },
        select: {
          name: true,
          weightDivision: true,
          rank: true,
          wins: true,
          losses: true,
          draws: true,
          imageUrl: true,
          country: true,
          poundForPoundRank: true,
          winsByKo: true,
          winsBySubmission: true,
        },
      }),
    ]);

    return {
      men: menChampion ? {
        ...menChampion,
        imageUrl: menChampion.imageUrl || "/images/default-avatar.png",
        record: `${menChampion.wins}-${menChampion.losses}-${menChampion.draws}`,
        winRate: menChampion.wins + menChampion.losses === 0 ? 0 : 
          Math.round((menChampion.wins / (menChampion.wins + menChampion.losses)) * 100),
        p4pRank: menChampion.poundForPoundRank,
      } : defaultChampion,
      women: womenChampion || defaultChampion,
    };
  } catch (error) {
    console.error("Error fetching champions:", error);
    throw new Error("Failed to fetch champions");
  }
}