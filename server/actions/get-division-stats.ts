'use server'

import prisma from '@/lib/prisma'
import { getAllDivisions } from '@/data/weight-class'

export async function getDivisionStats() {
  // Get all divisions
  const divisions = getAllDivisions()
  
  // Get athlete counts by division and month
  const athletes = await prisma.athlete.findMany({
    where: {
      retired: false
    },
    select: {
      weightDivision: true,
      gender: true,
      createdAt: true
    }
  })

  // Create a map of division stats over time
  const divisionStats = divisions.map(division => {
    const monthlyData: { date: string; count: number }[] = []
    const now = new Date()
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1)

    // Initialize monthly counts
    for (let d = new Date(sixMonthsAgo); d <= now; d.setMonth(d.getMonth() + 1)) {
      monthlyData.push({
        date: d.toISOString().slice(0, 7), // YYYY-MM format
        count: 0
      })
    }

    // Get gender from slug (men-heavyweight or women-bantamweight)
    const isWomen = division.slug.startsWith('women-')
    const divisionGender = isWomen ? 'FEMALE' : 'MALE'

    // Count athletes for each month
    athletes.forEach(athlete => {
      const isCorrectDivision = athlete.weightDivision.toLowerCase() === division.name.toLowerCase()
      const isCorrectGender = athlete.gender === divisionGender
      const athleteDate = athlete.createdAt.toISOString().slice(0, 7)
      
      const monthData = monthlyData.find(m => m.date === athleteDate)
      if (monthData && isCorrectDivision && isCorrectGender) {
        monthData.count++
      }
    })

    return {
      name: division.name,
      slug: division.slug,
      data: monthlyData
    }
  })

  return divisionStats
} 