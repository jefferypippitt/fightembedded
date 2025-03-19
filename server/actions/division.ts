'use server'

import prisma from '@/lib/prisma'
import { getDivisionBySlug, parseDivisionSlug, getFullDivisionName } from '@/data/weight-class'
import type { Athlete } from '@/types/athlete'

export async function getDivisionAthletes(slug: string): Promise<{
  name: string
  athletes: Athlete[]
} | null> {
  try {
    const normalizedSlug = slug.toLowerCase()
    const { gender, isValid } = parseDivisionSlug(normalizedSlug)
    
    if (!isValid) return null
    
    const division = getDivisionBySlug(normalizedSlug)
    if (!division) return null
    
    const isWomen = gender === 'women'
    const fullDivisionName = getFullDivisionName(division, isWomen).toLowerCase()

    const athletes = await prisma.athlete.findMany({
      where: {
        weightDivision: {
          contains: fullDivisionName,
          mode: 'insensitive'
        },
        gender: isWomen ? 'FEMALE' : 'MALE',
        retired: false,
      },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        country: true,
        wins: true,
        losses: true,
        draws: true,
        winsByKo: true,
        winsBySubmission: true,
        rank: true,
        followers: true,
        age: true,
        retired: true,
        weightDivision: true,
        gender: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    // Sort athletes by rank, with rank 0 appearing last
    const sortedAthletes = athletes.sort((a, b) => {
      // If both have rank 0, sort by name
      if (a.rank === 0 && b.rank === 0) {
        return a.name.localeCompare(b.name)
      }
      // If only one has rank 0, put it last
      if (a.rank === 0) return 1
      if (b.rank === 0) return -1
      // Sort by rank number (1, 2, 3, etc.)
      return Number(a.rank) - Number(b.rank)
    })

    return {
      name: fullDivisionName,
      athletes: sortedAthletes
    }
  } catch {
    return null
  }
} 