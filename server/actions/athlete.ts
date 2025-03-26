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

export async function getUndefeatedAthletes() {
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
}

export async function getRetiredAthletes() {
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
} 