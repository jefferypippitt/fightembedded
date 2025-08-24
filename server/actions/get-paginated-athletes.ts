"use server";

import prisma from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";
import type { Athlete } from "@/types/athlete";
import { Prisma } from "@prisma/client";

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

export async function getPaginatedAthletes(params: {
  page: number;
  pageSize: number;
  q?: string;
  view?: string;
  gender?: string;
  sort?: string;
  columnFilters?: { id: string; value: string[] }[];
}) {
  noStore(); // Force fresh data - disable all caching

  const { page, pageSize, q, view, gender, sort, columnFilters } = params;

  const where: Prisma.AthleteWhereInput = {};

  if (q) {
    where.name = {
      contains: q,
      mode: "insensitive",
    };
  }

  if (gender && gender !== "ALL") {
    where.gender = gender;
  }

  const weightDivisionFilter = columnFilters?.find(
    (filter) => filter.id === "weightDivision"
  );

  if (weightDivisionFilter && weightDivisionFilter.value.length > 0) {
    where.weightDivision = {
      in: weightDivisionFilter.value,
    };
  }

  // Set retired filter based on view
  if (view === "retired") {
    where.retired = true;
  } else {
    where.retired = false;
  }

  // Set losses filter for undefeated view
  if (view === "undefeated") {
    where.losses = 0;
  }

  // Set rank filter for champions view
  if (view === "champions") {
    where.rank = 1;
  }

  const sortOrder = sort?.split(".")?.[1] || "asc";
  const sortColumn =
    sort?.split(".")?.[0] || (view === "p4p" ? "poundForPoundRank" : "rank");

  // Ensure proper default sorting for each view
  let effectiveSortColumn = sortColumn;
  if (!sort) {
    if (view === "p4p") {
      effectiveSortColumn = "poundForPoundRank";
    } else if (
      view === "athletes" ||
      view === "champions" ||
      view === "undefeated"
    ) {
      effectiveSortColumn = "rank";
    } else if (view === "retired") {
      effectiveSortColumn = "name";
    }
  }

  let athletes;

  // Use explicit sorting instead of dynamic keys to avoid Prisma issues
  if (view === "champions") {
    // Champions view - only show rank 1 athletes
    athletes = await prisma.athlete.findMany({
      where,
      select: athleteSelect,
      orderBy: [
        {
          weightDivision: "asc",
        },
        {
          name: "asc",
        },
      ],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  } else if (view === "p4p") {
    // Special handling for P4P view - include all athletes but prioritize P4P rankings
    // Get P4P ranked athletes first (1-15), then division ranked athletes, then unranked ones

    // 1. P4P ranked athletes (1-15) - highest priority
    const p4pRankedAthletes = await prisma.athlete.findMany({
      where: {
        ...where,
        poundForPoundRank: { gt: 0, lte: 15 }, // Only P4P ranked 1-15
      },
      select: athleteSelect,
      orderBy: [
        {
          poundForPoundRank: "asc", // Always ascending for P4P view (1, 2, 3... 15)
        },
        {
          name: "asc",
        },
      ],
    });

    // 2. Division ranked athletes (but not P4P ranked) - medium priority
    const divisionRankedAthletes = await prisma.athlete.findMany({
      where: {
        ...where,
        rank: { gt: 0 }, // Division ranked
        poundForPoundRank: { not: { gt: 0, lte: 15 } }, // Not P4P ranked 1-15
      },
      select: athleteSelect,
      orderBy: [
        {
          rank: "asc", // Sort by division rank
        },
        {
          name: "asc",
        },
      ],
    });

    // 3. Unranked athletes (no division rank, no P4P rank) - lowest priority
    const unrankedAthletes = await prisma.athlete.findMany({
      where: {
        ...where,
        rank: 0, // No division rank
        poundForPoundRank: { not: { gt: 0, lte: 15 } }, // Not P4P ranked 1-15
      },
      select: athleteSelect,
      orderBy: [
        {
          name: "asc", // Sort unranked by name
        },
      ],
    });

    // Combine in priority order: P4P ranked first, then division ranked, then unranked
    const allP4PAthletes = [
      ...p4pRankedAthletes,
      ...divisionRankedAthletes,
      ...unrankedAthletes,
    ];

    // Apply pagination to the combined results
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    athletes = allP4PAthletes.slice(startIndex, endIndex);
  } else if (view === "undefeated") {
    // Undefeated view - only show athletes with 0 losses
    athletes = await prisma.athlete.findMany({
      where,
      select: athleteSelect,
      orderBy: [
        {
          rank: "asc",
        },
        {
          name: "asc",
        },
      ],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  } else if (view === "retired") {
    // Retired view - only show retired athletes
    // For retired athletes, we'll use the rank field to store their retirement order
    // This allows admins to manually reorder retired athletes for display purposes
    athletes = await prisma.athlete.findMany({
      where,
      select: athleteSelect,
      orderBy: [
        {
          rank: "asc", // Sort by retirement order (1, 2, 3...)
        },
        {
          name: "asc", // Fallback to name if ranks are equal
        },
      ],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  } else if (effectiveSortColumn === "rank") {
    // For rank sorting, we need to handle 0 values (unranked) specially
    // Get ranked athletes first, then unranked ones
    const rankedAthletes = await prisma.athlete.findMany({
      where: {
        ...where,
        rank: { gt: 0 }, // Only ranked athletes
      },
      select: athleteSelect,
      orderBy: [
        {
          rank: sortOrder === "desc" ? "desc" : "asc",
        },
        {
          name: "asc",
        },
      ],
    });

    const unrankedAthletes = await prisma.athlete.findMany({
      where: {
        ...where,
        rank: 0, // Only unranked athletes
      },
      select: athleteSelect,
      orderBy: [
        {
          name: "asc", // Sort unranked by name
        },
      ],
    });

    // Combine ranked and unranked athletes
    const allAthletes = [...rankedAthletes, ...unrankedAthletes];

    // Apply pagination to the combined results
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    athletes = allAthletes.slice(startIndex, endIndex);
  } else if (effectiveSortColumn === "name") {
    athletes = await prisma.athlete.findMany({
      where,
      select: athleteSelect,
      orderBy: [
        {
          name: sortOrder === "desc" ? "desc" : "asc",
        },
      ],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  } else if (effectiveSortColumn === "weightDivision") {
    athletes = await prisma.athlete.findMany({
      where,
      select: athleteSelect,
      orderBy: [
        {
          weightDivision: sortOrder === "desc" ? "desc" : "asc",
        },
        {
          name: "asc",
        },
      ],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  } else if (effectiveSortColumn === "winsByKo") {
    athletes = await prisma.athlete.findMany({
      where,
      select: athleteSelect,
      orderBy: [
        {
          winsByKo: sortOrder === "desc" ? "desc" : "asc",
        },
        {
          name: "asc",
        },
      ],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  } else if (effectiveSortColumn === "winsBySubmission") {
    athletes = await prisma.athlete.findMany({
      where,
      select: athleteSelect,
      orderBy: [
        {
          winsBySubmission: sortOrder === "desc" ? "desc" : "asc",
        },
        {
          name: "asc",
        },
      ],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  } else if (effectiveSortColumn === "country") {
    athletes = await prisma.athlete.findMany({
      where,
      select: athleteSelect,
      orderBy: [
        {
          country: sortOrder === "desc" ? "desc" : "asc",
        },
        {
          name: "asc",
        },
      ],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  } else if (effectiveSortColumn === "gender") {
    athletes = await prisma.athlete.findMany({
      where,
      select: athleteSelect,
      orderBy: [
        {
          gender: sortOrder === "desc" ? "desc" : "asc",
        },
        {
          name: "asc",
        },
      ],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  } else if (effectiveSortColumn === "poundForPoundRank") {
    athletes = await prisma.athlete.findMany({
      where,
      select: athleteSelect,
      orderBy: [
        {
          poundForPoundRank: sortOrder === "desc" ? "desc" : "asc",
        },
        {
          name: "asc",
        },
      ],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  } else {
    // Default sorting based on view
    if (view === "p4p") {
      // For P4P view, default to poundForPoundRank ascending
      // Get P4P ranked athletes first (1-15), then division ranked athletes, then unranked ones

      // 1. P4P ranked athletes (1-15) - highest priority
      const p4pRankedAthletes = await prisma.athlete.findMany({
        where: {
          ...where,
          poundForPoundRank: { gt: 0, lte: 15 }, // Only P4P ranked 1-15
        },
        select: athleteSelect,
        orderBy: [
          {
            poundForPoundRank: "asc", // Always ascending for P4P view (1, 2, 3... 15)
          },
          {
            name: "asc",
          },
        ],
      });

      // 2. Division ranked athletes (but not P4P ranked) - medium priority
      const divisionRankedAthletes = await prisma.athlete.findMany({
        where: {
          ...where,
          rank: { gt: 0 }, // Division ranked
          poundForPoundRank: { not: { gt: 0, lte: 15 } }, // Not P4P ranked 1-15
        },
        select: athleteSelect,
        orderBy: [
          {
            rank: "asc", // Sort by division rank
          },
          {
            name: "asc",
          },
        ],
      });

      // 3. Unranked athletes (no division rank, no P4P rank) - lowest priority
      const unrankedAthletes = await prisma.athlete.findMany({
        where: {
          ...where,
          rank: 0, // No division rank
          poundForPoundRank: { not: { gt: 0, lte: 15 } }, // Not P4P ranked 1-15
        },
        select: athleteSelect,
        orderBy: [
          {
            name: "asc", // Sort unranked by name
          },
        ],
      });

      // Combine in priority order: P4P ranked first, then division ranked, then unranked
      const allP4PAthletes = [
        ...p4pRankedAthletes,
        ...divisionRankedAthletes,
        ...unrankedAthletes,
      ];

      // Apply pagination to the combined results
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      athletes = allP4PAthletes.slice(startIndex, endIndex);
    } else {
      // Default to rank sorting - ranked first, then unranked
      const rankedAthletes = await prisma.athlete.findMany({
        where: {
          ...where,
          rank: { gt: 0 },
        },
        select: athleteSelect,
        orderBy: [
          {
            rank: "asc",
          },
          {
            name: "asc",
          },
        ],
      });

      const unrankedAthletes = await prisma.athlete.findMany({
        where: {
          ...where,
          rank: 0,
        },
        select: athleteSelect,
        orderBy: [
          {
            name: "asc",
          },
        ],
      });

      // Combine ranked and unranked athletes
      const allAthletes = [...rankedAthletes, ...unrankedAthletes];

      // Apply pagination to the combined results
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      athletes = allAthletes.slice(startIndex, endIndex);
    }
  }

  const total = await prisma.athlete.count({ where });

  return {
    athletes: athletes as Athlete[],
    total,
  };
}
