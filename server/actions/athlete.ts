import prisma from "@/lib/prisma";
import { Athlete } from "@prisma/client";
import { unstable_cache } from 'next/cache';

export const getAthletes = unstable_cache(
  async (query?: string): Promise<Athlete[]> => {
    try {
      const athletes = await prisma.athlete.findMany({
        where: query ? {
          name: {
            contains: query,
            mode: 'insensitive'
          }
        } : undefined,
        orderBy: {
          name: 'asc'
        }
      })
      return athletes
    } catch (error) {
      console.error('Error fetching athletes:', error)
      throw new Error('Failed to fetch athletes')
    }
  },
  ['all-athletes'],
  { revalidate: 3600 } // Revalidate every hour
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
    } catch (error) {
      console.error('Error fetching undefeated athletes:', error)
      throw new Error('Failed to fetch undefeated athletes')
    }
  },
  ['undefeated-athletes'],
  { revalidate: 3600 } // Revalidate every hour
);

export const getRetiredAthletes = unstable_cache(
  async () => {
    try {
      const athletes = await prisma.athlete.findMany({
        where: {
          retired: true,
        },
        orderBy: {
          name: 'asc',
        },
      })
      return athletes
    } catch (error) {
      console.error('Error fetching retired athletes:', error)
      throw new Error('Failed to fetch retired athletes')
    }
  },
  ['retired-athletes'],
  { revalidate: 3600 } // Revalidate every hour
); 