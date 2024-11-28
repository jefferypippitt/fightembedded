import prisma from "@/lib/prisma";
import { Athlete } from "@prisma/client";

export async function getAthletes(query?: string): Promise<Athlete[]> {
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
} 