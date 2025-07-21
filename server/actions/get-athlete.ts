"use server";

import prisma from "@/lib/prisma";
import { Athlete } from "@prisma/client";
import { unstable_cache, unstable_noStore as noStore } from "next/cache";

export const getAthletesByDivision = unstable_cache(
  async (divisionName: string): Promise<Athlete[]> => {
    try {
      const athletes = await prisma.athlete.findMany({
        where: {
          weightDivision: {
            equals: divisionName,
            mode: "insensitive",
          },
          retired: false,
        },
      });

      return athletes;
    } catch (error) {
      console.error("Error fetching athletes:", error);
      throw new Error("Failed to fetch athletes");
    }
  },
  ["athletes-by-division"],
  {
    tags: ["athletes-by-division"],
  }
);

export const getAthlete = unstable_cache(
  async (id: string) => {
    try {
      const athlete = await prisma.athlete.findUnique({
        where: { id },
      });
      return athlete;
    } catch (error) {
      console.error("Error fetching athlete:", error);
      throw new Error("Failed to fetch athlete");
    }
  },
  ["athlete-by-id"],
  {
    tags: ["athlete-by-id"],
  }
);

export async function getAthleteForDashboard(id: string) {
  noStore(); // Disable caching for dashboard
  try {
    const athlete = await prisma.athlete.findUnique({
      where: { id },
    });
    return athlete;
  } catch (error) {
    console.error("Error fetching athlete:", error);
    throw new Error("Failed to fetch athlete");
  }
}

export const getAthletes = unstable_cache(
  async (): Promise<Athlete[]> => {
    console.log("🔄 [Base Query] Fetching athletes...");
    try {
      const athletes = await prisma.athlete.findMany({
        where: {
          retired: false,
        },
        orderBy: [{ rank: "asc" }, { name: "asc" }],
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
          poundForPoundRank: true,
        },
      });

      console.log("✅ [Base Query] Fetched", athletes.length, "athletes");

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
      console.error("❌ [Base Query] Error querying athletes:", error);
      throw new Error("Failed to query athletes");
    }
  },
  ["all-athletes-data", "athletes-page"],
  {
    tags: ["athletes", "homepage", "all-athletes-data", "athletes-page"],
  }
);
