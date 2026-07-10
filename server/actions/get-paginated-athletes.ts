"use server";

import prisma from "@/lib/prisma";
import { fetchBoundedTierPage } from "@/lib/paginate-athletes";
import type { Athlete } from "@/types/athlete";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const checkAuth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
};

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
  await checkAuth();

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
    const p4pWhere = { ...where, poundForPoundRank: { gt: 0, lte: 15 } };
    const divisionWhere = {
      ...where,
      rank: { gt: 0 },
      poundForPoundRank: { not: { gt: 0, lte: 15 } },
    };
    const unrankedWhere = {
      ...where,
      rank: 0,
      poundForPoundRank: { not: { gt: 0, lte: 15 } },
    };

    const [p4pCount, divisionCount, unrankedCount] = await Promise.all([
      prisma.athlete.count({ where: p4pWhere }),
      prisma.athlete.count({ where: divisionWhere }),
      prisma.athlete.count({ where: unrankedWhere }),
    ]);

    athletes = await fetchBoundedTierPage(
      [p4pCount, divisionCount, unrankedCount],
      page,
      pageSize,
      async (tierIndex, skip, take) => {
        if (tierIndex === 0) {
          return prisma.athlete.findMany({
            where: p4pWhere,
            select: athleteSelect,
            orderBy: [{ poundForPoundRank: "asc" }, { name: "asc" }],
            skip,
            take,
          });
        }
        if (tierIndex === 1) {
          return prisma.athlete.findMany({
            where: divisionWhere,
            select: athleteSelect,
            orderBy: [{ rank: "asc" }, { name: "asc" }],
            skip,
            take,
          });
        }
        return prisma.athlete.findMany({
          where: unrankedWhere,
          select: athleteSelect,
          orderBy: [{ name: "asc" }],
          skip,
          take,
        });
      }
    );
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
    // Sort by rank (retirement order, set during reorder) then alphabetically by name
    athletes = await prisma.athlete.findMany({
      where,
      select: athleteSelect,
      orderBy: [
        {
          rank: "asc", // Sort by rank (retirement order)
        },
        {
          name: "asc", // Then alphabetically by name
        },
      ],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  } else if (effectiveSortColumn === "rank") {
    const rankedWhere = { ...where, rank: { gt: 0 } };
    const unrankedWhere = { ...where, rank: 0 };

    const [rankedCount, unrankedCount] = await Promise.all([
      prisma.athlete.count({ where: rankedWhere }),
      prisma.athlete.count({ where: unrankedWhere }),
    ]);

    athletes = await fetchBoundedTierPage(
      [rankedCount, unrankedCount],
      page,
      pageSize,
      async (tierIndex, skip, take) => {
        if (tierIndex === 0) {
          return prisma.athlete.findMany({
            where: rankedWhere,
            select: athleteSelect,
            orderBy: [
              { rank: sortOrder === "desc" ? "desc" : "asc" },
              { name: "asc" },
            ],
            skip,
            take,
          });
        }
        return prisma.athlete.findMany({
          where: unrankedWhere,
          select: athleteSelect,
          orderBy: [{ name: "asc" }],
          skip,
          take,
        });
      }
    );
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
    const rankedWhere = { ...where, rank: { gt: 0 } };
    const unrankedWhere = { ...where, rank: 0 };

    const [rankedCount, unrankedCount] = await Promise.all([
      prisma.athlete.count({ where: rankedWhere }),
      prisma.athlete.count({ where: unrankedWhere }),
    ]);

    athletes = await fetchBoundedTierPage(
      [rankedCount, unrankedCount],
      page,
      pageSize,
      async (tierIndex, skip, take) => {
        if (tierIndex === 0) {
          return prisma.athlete.findMany({
            where: rankedWhere,
            select: athleteSelect,
            orderBy: [{ rank: "asc" }, { name: "asc" }],
            skip,
            take,
          });
        }
        return prisma.athlete.findMany({
          where: unrankedWhere,
          select: athleteSelect,
          orderBy: [{ name: "asc" }],
          skip,
          take,
        });
      }
    );
  }

  const total = await prisma.athlete.count({ where });

  return {
    athletes: athletes as Athlete[],
    total,
  };
}
