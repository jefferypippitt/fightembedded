"use server";

import prisma from "@/lib/prisma";
import { unstable_noStore as noStore, unstable_cache } from "next/cache";
import type { Athlete } from "@/types/athlete";
import { getDivisionBySlug, parseDivisionSlug, getFullDivisionName } from "@/data/weight-class";

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

// Base athlete query function
export async function queryAthletes(options: AthleteQueryOptions = {}): Promise<Athlete[]> {
  noStore();

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
      select: {
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
      },
    });

    // Sort athletes to put unranked (rank = 0) at the end
    const sortedAthletes = athletes.sort((a, b) => {
      if (a.rank === 0 && b.rank !== 0) return 1;
      if (a.rank !== 0 && b.rank === 0) return -1;
      if (a.rank === b.rank) return a.name.localeCompare(b.name);
      return a.rank - b.rank;
    });

    return sortedAthletes.map((athlete) => ({
      ...athlete,
      gender: athlete.gender as "MALE" | "FEMALE",
      retired: athlete.retired ?? false,
    }));
  } catch (error) {
    console.error("Error querying athletes:", error);
    throw new Error("Failed to query athletes");
  }
}

// Specific query functions that use the base query
export async function getAthletes(): Promise<Athlete[]> {
  return queryAthletes({ retired: false });
}

export async function getRetiredAthletes(): Promise<Athlete[]> {
  return queryAthletes({ retired: true });
}

export async function getTopAthletes(limit: number): Promise<Athlete[]> {
  return queryAthletes({
    retired: false,
    limit,
    orderBy: [{ field: "followers", direction: "desc" }],
  });
}

export async function getDivisionAthletes(slug: string): Promise<{
  name: string;
  athletes: Athlete[];
} | null> {
  try {
    const { gender, isValid } = parseDivisionSlug(slug.toLowerCase());
    
    if (!isValid) {
      console.error("Invalid division slug:", slug);
      return null;
    }
    
    const division = getDivisionBySlug(slug.toLowerCase());
    if (!division) {
      console.error("Division not found:", slug);
      return null;
    }
    
    const isWomen = gender === "women";
    const fullDivisionName = getFullDivisionName(division, isWomen).toLowerCase();

    const athletes = await queryAthletes({
      retired: false,
      gender: isWomen ? "FEMALE" : "MALE",
      weightDivision: fullDivisionName,
    });

    return {
      name: fullDivisionName,
      athletes,
    };
  } catch (error) {
    console.error("Error fetching division athletes:", error);
    throw new Error("Failed to fetch division athletes");
  }
}

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
    } catch (error) {
      console.error('Error fetching undefeated athletes:', error)
      throw new Error('Failed to fetch undefeated athletes')
    }
  },
  ['undefeated-athletes'],
  { revalidate: 3600 } // Revalidate every hour
); 