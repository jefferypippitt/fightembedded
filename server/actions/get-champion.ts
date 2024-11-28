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

type Athlete = {
  name: string;
  rank: number;
  wins: number;
  losses: number;
  draws: number;
  imageUrl: string;
  country: string;
  weightDivision: string;
  poundForPoundRank: number;
  record: string;
  winRate: number;
  p4pRank: number;
  koRate: number;
  submissionRate: number;
};

type ChampionsResponse = {
  men: Athlete[];
  women: Athlete[];
};

export async function getChampions(): Promise<ChampionsResponse> {
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
      men: menChampion ? [
        {
          ...menChampion,
          imageUrl: menChampion.imageUrl || "/images/default-avatar.png",
          record: `${menChampion.wins}-${menChampion.losses}-${menChampion.draws}`,
          winRate: menChampion.wins + menChampion.losses === 0 ? 0 : 
            Math.round((menChampion.wins / (menChampion.wins + menChampion.losses)) * 100),
          p4pRank: menChampion.poundForPoundRank,
          koRate: menChampion.wins === 0 ? 0 : Math.round((menChampion.winsByKo / menChampion.wins) * 100),
          submissionRate: menChampion.wins === 0 ? 0 : Math.round((menChampion.winsBySubmission / menChampion.wins) * 100),
        }
      ] : [defaultChampion],
      women: womenChampion ? [
        {
          ...womenChampion,
          imageUrl: womenChampion.imageUrl || "/images/default-avatar.png",
          record: `${womenChampion.wins}-${womenChampion.losses}-${womenChampion.draws}`,
          winRate: womenChampion.wins + womenChampion.losses === 0 ? 0 : 
            Math.round((womenChampion.wins / (womenChampion.wins + womenChampion.losses)) * 100),
          p4pRank: womenChampion.poundForPoundRank,
          koRate: womenChampion.wins === 0 ? 0 : Math.round((womenChampion.winsByKo / womenChampion.wins) * 100),
          submissionRate: womenChampion.wins === 0 ? 0 : Math.round((womenChampion.winsBySubmission / womenChampion.wins) * 100),
        }
      ] : [defaultChampion],
    };
  } catch (error) {
    console.error("Error fetching champions:", error);
    throw new Error("Failed to fetch champions");
  }
}