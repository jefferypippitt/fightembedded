"use server";

import prisma from "@/lib/prisma";
import { unstable_cache } from 'next/cache';
import { weightClasses } from "@/data/weight-class";

// Create a map of all valid divisions and their weights
const divisionWeights = new Map<string, number>();

// Add men's divisions
weightClasses.men.forEach(div => {
  divisionWeights.set(`Men's ${div.name}`, div.weight || 0);
});

// Add women's divisions
weightClasses.women.forEach(div => {
  divisionWeights.set(`Women's ${div.name}`, div.weight || 0);
});

export const getChampions = unstable_cache(
  async () => {
    const champions = await prisma.athlete.findMany({
      where: {
        rank: 1,
      },
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
  ['champions'],
  { revalidate: 86400 } // Revalidate every day, since champions don't change frequently
);
