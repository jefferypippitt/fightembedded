"use server";

import prisma from "@/lib/prisma";
import { unstable_cache, unstable_noStore as noStore } from "next/cache";
import type { Athlete } from "@/types/athlete";
import { Athlete as PrismaAthlete } from '@prisma/client';

// Cache duration constants
const CACHE_DURATION = 604800; // 1 week in seconds
const CACHE_TAGS = {
  ATHLETES: 'athletes',
  DIVISIONS: 'divisions',
  DIVISION_ATHLETES: 'division-athletes',
  HOMEPAGE: 'homepage'
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
    field: "rank" | "followers" | "name";
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
        orderBy = [{ field: "rank", direction: "asc" }, { field: "name", direction: "asc" }],
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
        orderBy: orderBy.map(({ field, direction }) => ({ [field]: direction })),
        select: athleteSelect,
      });

      return sortAthletes(athletes).map(transformAthlete);
    } catch {
      throw new Error("Failed to query athletes");
    }
  },
  ['athletes-query'],
  { 
    revalidate: 604800, // Cache for a week
    tags: ['athletes', 'homepage'] // Base tags for all athlete queries
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
        orderBy: [
          { rank: 'asc' },
          { name: 'asc' }
        ],
        select: athleteSelect,
      });

      return sortAthletes(athletes).map(transformAthlete);
    } catch {
      throw new Error("Failed to query athletes");
    }
  },
  ['all-athletes'],
  { 
    revalidate: CACHE_DURATION,
    tags: [CACHE_TAGS.ATHLETES, CACHE_TAGS.HOMEPAGE]
  }
);

export const getRetiredAthletes = unstable_cache(
  async (): Promise<Athlete[]> => {
    return queryAthletes({ retired: true });
  },
  ['retired-athletes', 'all-athletes'], // Share cache with all-athletes
  { revalidate: 604800 } // Cache for 1 week
);

export const getTopAthletes = unstable_cache(
  async (limit: number): Promise<Athlete[]> => {
    return queryAthletes({
      retired: false,
      limit,
      orderBy: [{ field: "followers", direction: "desc" }],
    });
  },
  ['top-athletes'],
  { revalidate: 604800 } // Cache for 1 week
);

export const getDivisionAthletes = unstable_cache(
  async (slug: string) => {
    if (!slug) {
      throw new Error('Invalid division slug');
    }

    // Parse the slug to get gender and division
    const [gender, ...rest] = slug.split('-');
    const divisionSlug = rest.join('-');
    const isWomen = gender === "women";

    // Map of slug variations to standard division names
    const menDivisions: Record<string, string> = {
      'heavyweight': 'Heavyweight',
      'light-heavyweight': 'Light Heavyweight',
      'middleweight': 'Middleweight',
      'welterweight': 'Welterweight',
      'lightweight': 'Lightweight',
      'featherweight': 'Featherweight',
      'bantamweight': 'Bantamweight',
      'flyweight': 'Flyweight'
    };

    const womenDivisions: Record<string, string> = {
      'featherweight': 'Featherweight',
      'bantamweight': 'Bantamweight',
      'flyweight': 'Flyweight',
      'strawweight': 'Strawweight'
    };

    // Get the standardized division name based on gender
    const divisionMap = isWomen ? womenDivisions : menDivisions;
    const standardDivision = divisionMap[divisionSlug.toLowerCase()] || divisionSlug;
    const fullDivisionName = isWomen ? `Women's ${standardDivision}` : `Men's ${standardDivision}`;

    try {
      const athletes = await prisma.athlete.findMany({
        where: {
          weightDivision: fullDivisionName,
          gender: isWomen ? "FEMALE" : "MALE",
          retired: false,
        },
        orderBy: [
          { rank: 'asc' },
          { name: 'asc' }
        ],
        select: athleteSelect,
      });

      return {
        name: fullDivisionName,
        athletes: sortAthletes(athletes).map(transformAthlete),
      };
    } catch {
      throw new Error('Failed to fetch division athletes');
    }
  },
  ['division-athletes', 'division'],
  { 
    revalidate: CACHE_DURATION,
    tags: [CACHE_TAGS.ATHLETES, CACHE_TAGS.DIVISIONS, CACHE_TAGS.DIVISION_ATHLETES]
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
          wins: 'desc',
        },
      })
      return athletes
    } catch {
      throw new Error('Failed to fetch undefeated athletes');
    }
  },
  ['undefeated-athletes'],
  { revalidate: 3600 } // Revalidate every hour
);

export const getChampions = unstable_cache(
  async () => {
    try {
      const champions = await prisma.athlete.findMany({
        where: {
          rank: 1,
          retired: false,
        },
        orderBy: {
          weightDivision: 'asc',
        },
        select: athleteSelect,
      });

      return champions.map(transformAthlete);
    } catch {
      throw new Error('Failed to fetch champions');
    }
  },
  ['champions'],
  { 
    revalidate: CACHE_DURATION,
    tags: [CACHE_TAGS.ATHLETES, CACHE_TAGS.HOMEPAGE]
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