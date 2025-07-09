"use server";

import prisma from "@/lib/prisma";
import { unstable_cache, unstable_noStore as noStore } from "next/cache";
import type { Athlete } from "@/types/athlete";
import { Athlete as PrismaAthlete } from "@prisma/client";

// Cache duration constants
const CACHE_DURATION = 604800; // 1 week in seconds
const CACHE_TAGS = {
  ATHLETES: "athletes",
  DIVISIONS: "divisions",
  DIVISION_ATHLETES: "division-athletes",
  HOMEPAGE: "homepage",
} as const;

// Common select fields for athlete queries
const athleteSelect = {
  id: true,
  name: true,
  gender: true,
  weightDivision: true,
  country: true,
  wins: true,
  losses: true,
  draws: true,
  winsByKo: true,
  winsBySubmission: true,
  followers: true,
  imageUrl: true,
  retired: true,
  age: true,
  rank: true,
  createdAt: true,
  updatedAt: true,
  poundForPoundRank: true,
} as const;

// Helper function to sort athletes
const sortAthletes = (athletes: PrismaAthlete[]) => {
  return athletes.sort((a, b) => {
    if (a.rank === 0 && b.rank !== 0) return 1;
    if (a.rank !== 0 && b.rank === 0) return -1;
    if (a.rank === b.rank) return a.name.localeCompare(b.name);
    return a.rank - b.rank;
  });
};

// Helper function to transform athlete data
const transformAthlete = (athlete: PrismaAthlete) => ({
  ...athlete,
  gender: athlete.gender as "MALE" | "FEMALE",
  retired: athlete.retired ?? false,
});

// Base query options type
interface AthleteQueryOptions {
  retired?: boolean;
  gender?: "MALE" | "FEMALE";
  weightDivision?: string;
  limit?: number;
  orderBy?: {
    field: "rank" | "followers" | "name" | "updatedAt";
    direction: "asc" | "desc";
  }[];
}

// Base athlete query function with caching
export const queryAthletes = unstable_cache(
  async (options: AthleteQueryOptions = {}): Promise<Athlete[]> => {
    try {
      const {
        retired,
        gender,
        weightDivision,
        limit,
        orderBy = [
          { field: "rank", direction: "asc" },
          { field: "name", direction: "asc" },
        ],
      } = options;

      const athletes = await prisma.athlete.findMany({
        where: {
          ...(retired !== undefined && { retired }),
          ...(gender && { gender }),
          ...(weightDivision && {
            weightDivision: {
              contains: weightDivision,
              mode: "insensitive",
            },
          }),
        },
        ...(limit && { take: limit }),
        orderBy: orderBy.map(({ field, direction }) => ({
          [field]: direction,
        })),
        select: athleteSelect,
      });

      return sortAthletes(athletes).map(transformAthlete);
    } catch {
      throw new Error("Failed to query athletes");
    }
  },
  ["athletes-query"],
  {
    revalidate: 604800, // Cache for a week
    tags: ["athletes", "homepage"],
  }
);

// Specific query functions that use the base query
export const getAthletes = unstable_cache(
  async (): Promise<Athlete[]> => {
    try {
      const athletes = await prisma.athlete.findMany({
        where: {
          retired: false,
        },
        orderBy: [{ rank: "asc" }, { name: "asc" }],
        select: athleteSelect,
      });

      return sortAthletes(athletes).map(transformAthlete);
    } catch {
      throw new Error("Failed to query athletes");
    }
  },
  ["all-athletes"],
  {
    revalidate: CACHE_DURATION,
    tags: [CACHE_TAGS.ATHLETES, CACHE_TAGS.HOMEPAGE],
  }
);

export const getRetiredAthletes = unstable_cache(
  async (): Promise<Athlete[]> => {
    try {
      const athletes = await prisma.athlete.findMany({
        where: {
          retired: true,
        },
        orderBy: [{ updatedAt: "desc" }, { name: "asc" }],
        select: athleteSelect,
      });

      return athletes.map(transformAthlete);
    } catch {
      throw new Error("Failed to query retired athletes");
    }
  },
  ["retired-athletes-data", "retired-page"],
  {
    revalidate: 2592000, // Cache for 1 month (30 days) - retired athletes rarely change
    tags: [
      CACHE_TAGS.ATHLETES,
      "retired-athletes",
      "retired-athletes-data",
      "retired-page",
    ],
  }
);

export const getTopAthletes = unstable_cache(
  async (limit: number): Promise<Athlete[]> => {
    return queryAthletes({
      retired: false,
      limit,
      orderBy: [{ field: "followers", direction: "desc" }],
    });
  },
  ["top-athletes"],
  {
    revalidate: CACHE_DURATION,
    tags: [CACHE_TAGS.ATHLETES, "top-athletes"],
  }
);

export const getDivisionAthletes = unstable_cache(
  async (slug: string) => {
    if (!slug) {
      throw new Error("Invalid division slug");
    }

    // Parse the slug to get gender and division
    const [gender, ...rest] = slug.split("-");
    const divisionSlug = rest.join("-");
    const isWomen = gender === "women";

    // Map of slug variations to standard division names
    const menDivisions: Record<string, string> = {
      heavyweight: "Heavyweight",
      "light-heavyweight": "Light Heavyweight",
      middleweight: "Middleweight",
      welterweight: "Welterweight",
      lightweight: "Lightweight",
      featherweight: "Featherweight",
      bantamweight: "Bantamweight",
      flyweight: "Flyweight",
    };

    const womenDivisions: Record<string, string> = {
      featherweight: "Featherweight",
      bantamweight: "Bantamweight",
      flyweight: "Flyweight",
      strawweight: "Strawweight",
    };

    // Get the standardized division name based on gender
    const divisionMap = isWomen ? womenDivisions : menDivisions;
    const standardDivision =
      divisionMap[divisionSlug.toLowerCase()] || divisionSlug;
    const fullDivisionName = isWomen
      ? `Women's ${standardDivision}`
      : `Men's ${standardDivision}`;

    try {
      const athletes = await prisma.athlete.findMany({
        where: {
          weightDivision: fullDivisionName,
          gender: isWomen ? "FEMALE" : "MALE",
          retired: false,
        },
        orderBy: [{ rank: "asc" }, { name: "asc" }],
        select: athleteSelect,
      });

      return {
        name: fullDivisionName,
        athletes: sortAthletes(athletes).map(transformAthlete),
      };
    } catch {
      throw new Error("Failed to fetch division athletes");
    }
  },
  ["division-athletes", "division"],
  {
    revalidate: CACHE_DURATION,
    tags: [
      CACHE_TAGS.ATHLETES,
      CACHE_TAGS.DIVISIONS,
      CACHE_TAGS.DIVISION_ATHLETES,
    ],
  }
);

export const getUndefeatedAthletes = unstable_cache(
  async () => {
    try {
      const athletes = await prisma.athlete.findMany({
        where: {
          losses: 0,
          retired: false,
        },
        orderBy: {
          wins: "desc",
        },
      });
      return athletes;
    } catch {
      throw new Error("Failed to fetch undefeated athletes");
    }
  },
  ["undefeated-athletes"],
  {
    revalidate: 3600, // Revalidate every hour
    tags: [CACHE_TAGS.ATHLETES, "undefeated-athletes"],
  }
);

// Map of division names to their weight order (higher number = heavier)
const divisionWeights = new Map([
  // Men's divisions
  ["Heavyweight", 8],
  ["Light Heavyweight", 7],
  ["Middleweight", 6],
  ["Welterweight", 5],
  ["Lightweight", 4],
  ["Featherweight", 3],
  ["Bantamweight", 2],
  ["Flyweight", 1],
  // Women's divisions
  ["Women's Featherweight", 4],
  ["Women's Bantamweight", 3],
  ["Women's Flyweight", 2],
  ["Women's Strawweight", 1],
]);

export const getChampions = unstable_cache(
  async () => {
    const champions = await prisma.athlete.findMany({
      where: {
        rank: 1, // Only get rank 1 athletes (champions)
      },
      select: athleteSelect,
    });

    const maleChampions = champions
      .filter((champion) => champion.gender === "MALE")
      .sort((a, b) => {
        const weightA = divisionWeights.get(a.weightDivision) ?? 999;
        const weightB = divisionWeights.get(b.weightDivision) ?? 999;

        // If both divisions are unknown, sort alphabetically
        if (weightA === 999 && weightB === 999) {
          return a.weightDivision.localeCompare(b.weightDivision);
        }

        return weightB - weightA; // Sort heaviest to lightest
      });

    const femaleChampions = champions
      .filter((champion) => champion.gender === "FEMALE")
      .sort((a, b) => {
        const weightA = divisionWeights.get(a.weightDivision) ?? 999;
        const weightB = divisionWeights.get(b.weightDivision) ?? 999;

        // If both divisions are unknown, sort alphabetically
        if (weightA === 999 && weightB === 999) {
          return a.weightDivision.localeCompare(b.weightDivision);
        }

        return weightB - weightA; // Sort heaviest to lightest
      });

    return {
      maleChampions,
      femaleChampions,
    };
  },
  ["champions-data", "homepage-champions"],
  {
    revalidate: 604800, // Cache for 1 week (7 days)
    tags: [
      CACHE_TAGS.ATHLETES,
      CACHE_TAGS.HOMEPAGE,
      "champions",
      "champions-data",
      "homepage-champions",
    ], // More specific tags to avoid conflicts
  }
);

// Dashboard-specific functions that don't use caching
export async function getAthletesForDashboard() {
  noStore(); // Disable caching for dashboard
  return getAthletes();
}

export async function getRetiredAthletesForDashboard() {
  noStore(); // Disable caching for dashboard
  return getRetiredAthletes();
}

export async function getUndefeatedAthletesForDashboard() {
  noStore(); // Disable caching for dashboard
  return getUndefeatedAthletes();
}
