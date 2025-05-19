"use server";

import prisma from "@/lib/prisma";
import { Athlete } from "@prisma/client";
import { unstable_cache } from 'next/cache';

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
  ['athletes-by-division'],
  { revalidate: 3600 } // Revalidate every hour
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
  ['athlete-by-id'],
  { revalidate: 3600 } // Revalidate every hour
);
