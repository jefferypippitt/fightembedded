"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { athleteSchema } from "@/schemas/athlete";
import { z } from "zod";
import { AthleteInput, ActionResponse, Athlete } from "@/types/athlete";
import {
  revalidatePath,
  revalidateTag,
  unstable_noStore as noStore,
} from "next/cache";

// Authentication helper
async function checkAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

// Get single athlete by ID
export async function getAthlete(id: string): Promise<Athlete | null> {
  try {
    noStore(); // Force fresh data
    const athlete = await prisma.athlete.findUnique({
      where: { id },
    });
    return athlete;
  } catch (error) {
    console.error("Error fetching athlete:", error);
    throw new Error("Failed to fetch athlete");
  }
}

// Get all athletes (always fresh)
export async function getAllAthletes(): Promise<Athlete[]> {
  try {
    noStore(); // Force fresh data
    const athletes = await prisma.athlete.findMany({
      orderBy: [{ rank: "asc" }, { name: "asc" }],
    });

    // Sort athletes by rank first, then by name for same rank
    athletes.sort((a, b) => {
      // If both have ranks, sort by rank
      if (a.rank !== undefined && b.rank !== undefined) {
        return a.rank - b.rank;
      }

      // If only one has a rank, put the ranked one first
      if (a.rank !== undefined && b.rank === undefined) {
        return -1;
      }
      if (a.rank === undefined && b.rank !== undefined) {
        return 1;
      }

      // If neither has a rank, sort by name
      return a.name.localeCompare(b.name);
    });

    return athletes;
  } catch (error) {
    console.error("Error fetching all athletes:", error);
    return [];
  }
}

// Get active athletes (always fresh, for main athletes page)
export async function getAthletes(): Promise<Athlete[]> {
  try {
    noStore(); // Force fresh data
    const athletes = await prisma.athlete.findMany({
      where: { retired: false },
      orderBy: [{ rank: "asc" }, { name: "asc" }],
    });

    // Sort athletes by rank first, then by name for same rank
    athletes.sort((a, b) => {
      // If both have ranks, sort by rank
      if (a.rank !== undefined && b.rank !== undefined) {
        return a.rank - b.rank;
      }

      // If only one has a rank, put the ranked one first
      if (a.rank !== undefined && b.rank === undefined) {
        return -1;
      }
      if (a.rank === undefined && b.rank !== undefined) {
        return 1;
      }

      // If neither has a rank, sort by name
      return a.name.localeCompare(b.name);
    });

    return athletes;
  } catch (error) {
    console.error("Error fetching active athletes:", error);
    return [];
  }
}

// Get athletes by division (always fresh)
export async function getAthletesByDivision(
  division: string
): Promise<Athlete[]> {
  try {
    noStore(); // Force fresh data
    const athletes = await prisma.athlete.findMany({
      where: { weightDivision: division },
      orderBy: { rank: "asc" },
    });

    // Sort athletes by rank first, then by name for same rank
    athletes.sort((a, b) => {
      // If both have ranks, sort by rank
      if (a.rank !== undefined && b.rank !== undefined) {
        return a.rank - b.rank;
      }

      // If only one has a rank, put the ranked one first
      if (a.rank !== undefined && b.rank === undefined) {
        return -1;
      }
      if (a.rank === undefined && b.rank !== undefined) {
        return 1;
      }

      // If neither has a rank, sort by name
      return a.name.localeCompare(b.name);
    });

    return athletes;
  } catch (error) {
    console.error("Error fetching athletes by division:", error);
    return [];
  }
}

// Get division athletes by slug (always fresh, for division pages)
export async function getDivisionAthletes(
  slug: string
): Promise<{ name: string; athletes: Athlete[] } | null> {
  try {
    noStore(); // Force fresh data
    // Parse the slug to get gender and division
    const [gender, ...rest] = slug.split("-");
    const divisionSlug = rest.join("-");
    const isWomen = gender === "women";

    // Map of slug variations to standard division names
    const menDivisions: Record<string, string> = {
      heavyweight: "Heavyweight",
      "light-heavyweight": "Light Heavyweight",
      middleweight: "Middleweight",
      welterweight: "Welterweight",
      lightweight: "Lightweight",
      featherweight: "Featherweight",
      bantamweight: "Bantamweight",
      flyweight: "Flyweight",
    };

    const womenDivisions: Record<string, string> = {
      featherweight: "Featherweight",
      bantamweight: "Bantamweight",
      flyweight: "Flyweight",
      strawweight: "Strawweight",
    };

    // Get the standardized division name based on gender
    const divisionMap = isWomen ? womenDivisions : menDivisions;
    const standardDivision =
      divisionMap[divisionSlug.toLowerCase()] || divisionSlug;
    const fullDivisionName = isWomen
      ? `Women's ${standardDivision}`
      : `Men's ${standardDivision}`;

    const athletes = await prisma.athlete.findMany({
      where: {
        weightDivision: fullDivisionName,
        gender: isWomen ? "FEMALE" : "MALE",
        retired: false,
      },
      orderBy: [{ rank: "asc" }, { name: "asc" }],
    });

    // Sort athletes by rank first, then by name for same rank
    athletes.sort((a, b) => {
      // Handle unranked athletes (rank 0 or undefined)
      const aRank = a.rank && a.rank > 0 ? a.rank : Infinity;
      const bRank = b.rank && b.rank > 0 ? b.rank : Infinity;

      // If both have valid ranks, sort by rank
      if (aRank !== Infinity && bRank !== Infinity) {
        return aRank - bRank;
      }

      // If only one has a valid rank, put the ranked one first
      if (aRank !== Infinity && bRank === Infinity) {
        return -1;
      }
      if (aRank === Infinity && bRank !== Infinity) {
        return 1;
      }

      // If neither has a valid rank, sort by name
      return a.name.localeCompare(b.name);
    });

    return {
      name: fullDivisionName,
      athletes,
    };
  } catch (error) {
    console.error("Error fetching division athletes:", error);
    return null;
  }
}

// Get top 20 athletes by followers (always fresh)
export async function getTop20Athletes(): Promise<{
  maleAthletes: {
    id: string;
    name: string;
    followers: number;
    gender: string;
  }[];
  femaleAthletes: {
    id: string;
    name: string;
    followers: number;
    gender: string;
  }[];
}> {
  try {
    noStore(); // Force fresh data
    // Fetch top 20 male athletes
    const maleAthletes = await prisma.athlete.findMany({
      where: {
        AND: [{ gender: "MALE" }, { retired: false }, { followers: { gt: 0 } }],
      },
      orderBy: {
        followers: "desc",
      },
      select: {
        id: true,
        name: true,
        followers: true,
        gender: true,
      },
      take: 20,
    });

    // Fetch top 20 female athletes
    const femaleAthletes = await prisma.athlete.findMany({
      where: {
        AND: [
          { gender: "FEMALE" },
          { retired: false },
          { followers: { gt: 0 } },
        ],
      },
      orderBy: {
        followers: "desc",
      },
      select: {
        id: true,
        name: true,
        followers: true,
        gender: true,
      },
      take: 20,
    });

    return {
      maleAthletes,
      femaleAthletes,
    };
  } catch (error) {
    console.error("Error fetching top athletes:", error);
    throw new Error("Failed to fetch top athletes");
  }
}

// Get top 5 athletes by followers (always fresh)
export async function getTop5Athletes(): Promise<Athlete[]> {
  try {
    noStore(); // Force fresh data
    const athletes = await prisma.athlete.findMany({
      where: { retired: false },
      orderBy: { followers: "desc" },
      take: 5,
    });
    return athletes;
  } catch (error) {
    console.error("Error fetching top 5 athletes:", error);
    return [];
  }
}

// Get pound-for-pound rankings (always fresh)
export async function getP4PRankings(): Promise<{
  male: Athlete[];
  female: Athlete[];
}> {
  try {
    noStore(); // Force fresh data
    const [male, female] = await Promise.all([
      prisma.athlete.findMany({
        where: {
          gender: "MALE",
          retired: false,
          poundForPoundRank: { gt: 0 },
        },
        orderBy: { poundForPoundRank: "asc" },
      }),
      prisma.athlete.findMany({
        where: {
          gender: "FEMALE",
          retired: false,
          poundForPoundRank: { gt: 0 },
        },
        orderBy: { poundForPoundRank: "asc" },
      }),
    ]);

    return { male, female };
  } catch (error) {
    console.error("Error fetching P4P rankings:", error);
    return { male: [], female: [] };
  }
}

// Get live P4P rankings (no cache, for homepage)
export async function getLiveP4PRankings(): Promise<{
  maleP4PRankings: Athlete[];
  femaleP4PRankings: Athlete[];
}> {
  try {
    noStore(); // Force fresh data
    const [male, female] = await Promise.all([
      prisma.athlete.findMany({
        where: {
          gender: "MALE",
          retired: false,
          poundForPoundRank: { gt: 0 },
        },
        orderBy: { poundForPoundRank: "asc" },
      }),
      prisma.athlete.findMany({
        where: {
          gender: "FEMALE",
          retired: false,
          poundForPoundRank: { gt: 0 },
        },
        orderBy: { poundForPoundRank: "asc" },
      }),
    ]);

    return { maleP4PRankings: male, femaleP4PRankings: female };
  } catch (error) {
    console.error("Error fetching live P4P rankings:", error);
    return { maleP4PRankings: [], femaleP4PRankings: [] };
  }
}

// Get champions (always fresh)
export async function getChampions(): Promise<Athlete[]> {
  try {
    noStore(); // Force fresh data
    const champions = await prisma.athlete.findMany({
      where: { rank: 1, retired: false },
      orderBy: { weightDivision: "asc" },
    });
    return champions;
  } catch (error) {
    console.error("Error fetching champions:", error);
    return [];
  }
}

// Get live champions (no cache, for homepage)
export async function getLiveChampions(): Promise<{
  maleChampions: Athlete[];
  femaleChampions: Athlete[];
}> {
  try {
    noStore(); // Force fresh data
    const champions = await prisma.athlete.findMany({
      where: { rank: 1, retired: false },
      orderBy: { weightDivision: "asc" },
    });

    const maleChampions = champions.filter(
      (champion) => champion.gender === "MALE"
    );
    const femaleChampions = champions.filter(
      (champion) => champion.gender === "FEMALE"
    );

    return { maleChampions, femaleChampions };
  } catch (error) {
    console.error("Error fetching live champions:", error);
    return { maleChampions: [], femaleChampions: [] };
  }
}

// Get retired athletes (always fresh)
export async function getRetiredAthletes(): Promise<Athlete[]> {
  try {
    noStore(); // Force fresh data
    const retiredAthletes = await prisma.athlete.findMany({
      where: { retired: true },
      orderBy: [
        { rank: "asc" }, // Sort by retirement order (1, 2, 3...)
        { name: "asc" }, // Fallback to name if ranks are equal or 0
      ],
    });

    // If no athletes have retirement order set, they'll be sorted by name
    // This provides a good default until retirement order is manually set
    return retiredAthletes;
  } catch (error) {
    console.error("Error fetching retired athletes:", error);
    return [];
  }
}

// Get undefeated athletes (always fresh)
export async function getUndefeatedAthletes(): Promise<Athlete[]> {
  try {
    noStore(); // Force fresh data
    const undefeatedAthletes = await prisma.athlete.findMany({
      where: { losses: 0, retired: false },
      orderBy: { wins: "desc" },
    });
    return undefeatedAthletes;
  } catch (error) {
    console.error("Error fetching undefeated athletes:", error);
    return [];
  }
}

// Get country statistics (always fresh)
export async function getCountryStats(): Promise<
  { country: string; count: number }[]
> {
  try {
    noStore(); // Force fresh data
    const stats = await prisma.athlete.groupBy({
      by: ["country"],
      _count: {
        country: true,
      },
      orderBy: {
        _count: {
          country: "desc",
        },
      },
    });

    return stats.map((stat) => ({
      country: stat.country,
      count: stat._count.country,
    }));
  } catch (error) {
    console.error("Error fetching country stats:", error);
    return [];
  }
}

// Create new athlete
export async function createAthlete(
  formData: FormData
): Promise<ActionResponse> {
  try {
    noStore(); // Force fresh data
    await checkAuth();
    const rawData = Object.fromEntries(formData.entries());

    const data: AthleteInput = {
      name: String(rawData.name),
      gender: rawData.gender as "MALE" | "FEMALE",
      weightDivision: String(rawData.weightDivision),
      country: String(rawData.country),
      age: parseInt(rawData.age as string),
      wins: parseInt(rawData.wins as string),
      losses: parseInt(rawData.losses as string),
      draws: parseInt(rawData.draws as string),
      winsByKo: parseInt(rawData.winsByKo as string),
      winsBySubmission: parseInt(rawData.winsBySubmission as string),
      followers: parseInt(rawData.followers as string),
      rank: rawData.rank ? parseInt(rawData.rank as string) : 0,
      poundForPoundRank: rawData.poundForPoundRank
        ? parseInt(rawData.poundForPoundRank as string)
        : 0,
      imageUrl: String(rawData.imageUrl),
      retired: rawData.retired === "true",
    };

    const validatedData = athleteSchema.parse(data);

    // If athlete is being created as retired, clear their ranks
    const finalData = {
      ...validatedData,
      rank: validatedData.retired ? 0 : validatedData.rank ?? 0,
      poundForPoundRank: validatedData.retired
        ? 0
        : validatedData.poundForPoundRank ?? 0,
    };

    const athlete = (await prisma.athlete.create({
      data: finalData,
    })) as Athlete;

    // Intelligent cache invalidation based on athlete properties
    const hasImage =
      validatedData.imageUrl && validatedData.imageUrl.trim() !== "";
    const isChampion = validatedData.rank === 1;
    const isUndefeated = validatedData.losses === 0;
    const isRetired = validatedData.retired;
    const hasP4PRank = (validatedData.poundForPoundRank ?? 0) > 0;

    // Always revalidate basic athlete data
    revalidateTag("all-athletes");
    revalidateTag("all-athletes-data");
    revalidateTag("athletes-page");
    revalidateTag("athletes-by-division");
    revalidateTag("division-athletes");
    revalidateTag("athletes");
    revalidateTag("homepage");
    revalidateTag("top-20-athletes");
    revalidateTag("top-5-athletes");

    // Only revalidate image-related caches if athlete has an image
    if (hasImage) {
      revalidateTag("athlete-images");
    }

    // Only revalidate specific caches based on athlete properties
    if (isChampion) {
      revalidateTag("champions-data");
      revalidateTag("homepage-champions");
    }

    if (isUndefeated) {
      revalidateTag("undefeated-athletes");
    }

    if (isRetired) {
      revalidateTag("retired-athletes-data");
      revalidateTag("retired-page");
    }

    if (hasP4PRank) {
      revalidateTag("p4p-rankings-data");
      revalidateTag("homepage-p4p");
    }

    // Only revalidate homepage if athlete affects homepage sections
    if (isChampion || hasP4PRank) {
      revalidateTag("homepage-stats");
    }

    // Revalidate paths (only for dynamic routes that need it)
    if (isRetired) {
      revalidatePath("/retired");
    }

    // Revalidate the specific division path
    const isWomen = validatedData.weightDivision.startsWith("Women's");
    const divisionName = validatedData.weightDivision.replace(
      /^(Women's|Men's)\s+/,
      ""
    );
    const divisionSlug = divisionName.toLowerCase().replace(/\s+/g, "-");
    const fullSlug = `${isWomen ? "women" : "men"}-${divisionSlug}`;
    revalidatePath(`/division/${fullSlug}`, "page");

    return {
      status: "success",
      message: "Athlete created successfully",
      data: athlete,
    };
  } catch (error) {
    console.error("Create athlete error:", error);

    if (error instanceof z.ZodError) {
      return {
        status: "error",
        message: `Validation error: ${error.errors
          .map((e) => e.message)
          .join(", ")}`,
      };
    }

    return {
      status: "error",
      message:
        error instanceof Error
          ? `Error creating athlete: ${error.message}`
          : "Failed to create athlete",
    };
  }
}

// Update existing athlete
export async function updateAthlete(
  id: string,
  formData: FormData
): Promise<ActionResponse> {
  try {
    noStore(); // Force fresh data
    await checkAuth();
    const rawData = Object.fromEntries(formData.entries());

    const data: AthleteInput = {
      name: String(rawData.name),
      gender: rawData.gender as "MALE" | "FEMALE",
      weightDivision: String(rawData.weightDivision),
      country: String(rawData.country),
      age: parseInt(rawData.age as string),
      wins: parseInt(rawData.wins as string),
      losses: parseInt(rawData.losses as string),
      draws: parseInt(rawData.draws as string),
      winsByKo: parseInt(rawData.winsByKo as string),
      winsBySubmission: parseInt(rawData.winsBySubmission as string),
      followers: parseInt(rawData.followers as string),
      rank: rawData.rank ? parseInt(rawData.rank as string) : 0,
      poundForPoundRank: rawData.poundForPoundRank
        ? parseInt(rawData.poundForPoundRank as string)
        : 0,
      imageUrl: String(rawData.imageUrl),
      retired: rawData.retired === "true",
    };

    const validatedData = athleteSchema.parse(data);

    // Get the current athlete to compare changes
    const currentAthlete = await prisma.athlete.findUnique({
      where: { id },
      select: {
        imageUrl: true,
        rank: true,
        poundForPoundRank: true,
        retired: true,
        losses: true,
        weightDivision: true,
        followers: true,
      },
    });

    // If athlete is being marked as retired, clear their ranks
    const finalData = {
      ...validatedData,
      rank: validatedData.retired ? 0 : validatedData.rank ?? 0,
      poundForPoundRank: validatedData.retired
        ? 0
        : validatedData.poundForPoundRank ?? 0,
      retired: validatedData.retired,
    };

    const athlete = await prisma.athlete.update({
      where: { id },
      data: finalData,
    });

    // Intelligent cache invalidation based on what actually changed
    const imageChanged = currentAthlete?.imageUrl !== validatedData.imageUrl;
    const rankChanged = currentAthlete?.rank !== finalData.rank;
    const p4pRankChanged =
      currentAthlete?.poundForPoundRank !== finalData.poundForPoundRank;
    const retiredStatusChanged = currentAthlete?.retired !== finalData.retired;
    const lossesChanged = currentAthlete?.losses !== finalData.losses;
    const divisionChanged =
      currentAthlete?.weightDivision !== finalData.weightDivision;

    // Always revalidate basic athlete data
    revalidateTag("all-athletes");
    revalidateTag("athlete-by-id");
    revalidateTag("athletes-by-division");
    revalidateTag("division-athletes");
    revalidateTag("top-20-athletes");
    revalidateTag("top-5-athletes");
    revalidateTag("athletes-page");
    revalidateTag("all-athletes-data");
    revalidateTag("athletes");
    revalidateTag("homepage");

    // Only revalidate image-related caches if image actually changed
    if (imageChanged) {
      revalidateTag("athlete-images");
    }

    // Only revalidate specific caches based on what changed
    if (rankChanged || p4pRankChanged) {
      revalidateTag("p4p-rankings-data");
      revalidateTag("homepage-p4p");
      if (finalData.rank === 1 || currentAthlete?.rank === 1) {
        revalidateTag("champions-data");
        revalidateTag("homepage-champions");
      }
    }

    if (retiredStatusChanged) {
      revalidateTag("retired-athletes-data");
      revalidateTag("retired-page");
    }

    if (
      lossesChanged &&
      (finalData.losses === 0 || currentAthlete?.losses === 0)
    ) {
      revalidateTag("undefeated-athletes");
    }

    // Only revalidate homepage if significant changes occurred that affect homepage sections
    if (rankChanged || p4pRankChanged || retiredStatusChanged) {
      revalidateTag("homepage-stats");
    }

    // Only revalidate paths for dynamic routes that need it
    if (retiredStatusChanged) {
      revalidatePath("/retired");
    }

    // Always revalidate division pages when any athlete is updated
    revalidatePath("/division/[slug]", "page");

    // Also revalidate the specific division path if we know the division
    if (currentAthlete?.weightDivision) {
      const isWomen = currentAthlete.weightDivision.startsWith("Women's");
      const divisionName = currentAthlete.weightDivision.replace(
        /^(Women's|Men's)\s+/,
        ""
      );
      const divisionSlug = divisionName.toLowerCase().replace(/\s+/g, "-");
      const fullSlug = `${isWomen ? "women" : "men"}-${divisionSlug}`;
      revalidatePath(`/division/${fullSlug}`, "page");
    }

    // If division changed, also revalidate the new division path
    if (divisionChanged && finalData.weightDivision) {
      const isWomen = finalData.weightDivision.startsWith("Women's");
      const divisionName = finalData.weightDivision.replace(
        /^(Women's|Men's)\s+/,
        ""
      );
      const divisionSlug = divisionName.toLowerCase().replace(/\s+/g, "-");
      const fullSlug = `${isWomen ? "women" : "men"}-${divisionSlug}`;
      revalidatePath(`/division/${fullSlug}`, "page");
    }

    return {
      status: "success",
      message: "Athlete updated successfully",
      data: athlete as Athlete,
    };
  } catch (error) {
    console.error("Update athlete error:", error);

    if (error instanceof z.ZodError) {
      return {
        status: "error",
        message: `Validation error: ${error.errors
          .map((e) => e.message)
          .join(", ")}`,
      };
    }

    // Handle Prisma errors
    if (
      error instanceof Error &&
      error.message.includes("Record to update not found")
    ) {
      return {
        status: "error",
        message: "Athlete not found",
      };
    }

    return {
      status: "error",
      message:
        error instanceof Error
          ? `Error updating athlete: ${error.message}`
          : "Failed to update athlete",
    };
  }
}

// Update athlete status (retired/active)
export async function updateAthleteStatus(
  athleteId: string,
  retired: boolean
): Promise<Athlete> {
  try {
    noStore(); // Force fresh data
    // Get athlete data before update to know the division
    const currentAthlete = await prisma.athlete.findUnique({
      where: { id: athleteId },
      select: { weightDivision: true },
    });

    const updateData: { retired: boolean; rank?: number } = {
      retired,
      ...(retired && { rank: 0 }), // If marking as retired, clear their rank
    };

    const updatedAthlete = await prisma.athlete.update({
      where: { id: athleteId },
      data: updateData,
    });

    // Revalidate cache tags
    revalidateTag("all-athletes");
    revalidateTag("athlete-by-id");
    revalidateTag("retired-athletes");
    revalidateTag("division-athletes");
    revalidateTag("athletes");
    revalidateTag("homepage");

    // Revalidate paths
    revalidatePath("/retired");
    revalidatePath("/athletes");
    revalidatePath(`/athlete/${athleteId}`);

    // Revalidate division page if we know the division
    if (currentAthlete?.weightDivision) {
      const isWomen = currentAthlete.weightDivision.startsWith("Women's");
      const divisionName = currentAthlete.weightDivision.replace(
        /^(Women's|Men's)\s+/,
        ""
      );
      const divisionSlug = divisionName.toLowerCase().replace(/\s+/g, "-");
      const fullSlug = `${isWomen ? "women" : "men"}-${divisionSlug}`;
      revalidatePath(`/division/${fullSlug}`, "page");
    }

    return updatedAthlete as Athlete;
  } catch (error) {
    console.error("Error updating athlete status:", error);
    throw new Error("Failed to update athlete status");
  }
}

// Delete athlete
export async function deleteAthlete(id: string) {
  try {
    noStore(); // Force fresh data
    await checkAuth();

    // Get athlete data before deletion to check attributes
    const athlete = await prisma.athlete.findUnique({
      where: { id },
    });

    if (!athlete) {
      throw new Error("Athlete not found");
    }

    await prisma.athlete.delete({
      where: {
        id,
      },
    });

    // Revalidate cache tags
    revalidateTag("all-athletes");
    revalidateTag("all-athletes-data");
    revalidateTag("athletes-page");
    revalidateTag("athlete-by-id");
    revalidateTag("athletes-by-division");
    revalidateTag("division-athletes");
    revalidateTag("athletes");
    revalidateTag("homepage");
    revalidateTag("top-20-athletes");
    revalidateTag("top-5-athletes");

    if (athlete.rank === 1) {
      revalidateTag("champions-data");
      revalidateTag("homepage-champions");
    }

    if (athlete.losses === 0) {
      revalidateTag("undefeated-athletes");
    }

    if (athlete.retired) {
      revalidateTag("retired-athletes-data");
      revalidateTag("retired-page");
    }

    if (athlete.poundForPoundRank > 0) {
      revalidateTag("p4p-rankings-data");
      revalidateTag("homepage-p4p");
    }

    // Only revalidate homepage if athlete affects homepage sections
    if (athlete.rank === 1 || athlete.poundForPoundRank > 0) {
      revalidateTag("homepage-stats");
    }

    // Revalidate paths for dynamic routes that need it
    if (athlete.retired) {
      revalidatePath("/retired");
    }

    // Revalidate the specific division path
    const isWomen = athlete.weightDivision.startsWith("Women's");
    const divisionName = athlete.weightDivision.replace(
      /^(Women's|Men's)\s+/,
      ""
    );
    const divisionSlug = divisionName.toLowerCase().replace(/\s+/g, "-");
    const fullSlug = `${isWomen ? "women" : "men"}-${divisionSlug}`;
    revalidatePath(`/division/${fullSlug}`, "page");

    return true;
  } catch (error) {
    console.error("Delete athlete error:", error);
    throw new Error("Failed to delete athlete");
  }
}

// Update athlete ranks in bulk (for drag and drop reordering)
export async function updateAthleteRanks(
  athleteRankUpdates: {
    id: string;
    rank?: number;
    poundForPoundRank?: number;
  }[]
): Promise<ActionResponse> {
  try {
    noStore(); // Force fresh data
    await checkAuth();

    // Validate input
    if (!Array.isArray(athleteRankUpdates) || athleteRankUpdates.length === 0) {
      return {
        status: "error",
        message: "Invalid input: athlete rank updates array is required",
      };
    }

    // Update each athlete's rank(s)
    const updatePromises = athleteRankUpdates.map((update) => {
      const updateData: {
        rank?: number;
        poundForPoundRank?: number;
      } = {};
      if (update.rank !== undefined) updateData.rank = update.rank;
      if (update.poundForPoundRank !== undefined)
        updateData.poundForPoundRank = update.poundForPoundRank;

      return prisma.athlete.update({
        where: { id: update.id },
        data: updateData,
      });
    });

    await Promise.all(updatePromises);

    // Revalidate cache tags
    revalidateTag("all-athletes");
    revalidateTag("all-athletes-data");
    revalidateTag("athletes-page");
    revalidateTag("athletes-by-division");
    revalidateTag("division-athletes");
    revalidateTag("athletes");
    revalidateTag("homepage");
    revalidateTag("top-20-athletes");
    revalidateTag("top-5-athletes");
    revalidateTag("champions-data");
    revalidateTag("homepage-champions");
    revalidateTag("p4p-rankings-data");
    revalidateTag("homepage-p4p");
    revalidateTag("retired-athletes-data");
    revalidateTag("retired-page");

    // Revalidate paths
    revalidatePath("/athletes");
    revalidatePath("/dashboard/athletes");
    revalidatePath("/retired");

    return {
      status: "success",
      message: "Athlete ranks updated successfully",
    };
  } catch (error) {
    console.error("Update athlete ranks error:", error);

    return {
      status: "error",
      message:
        error instanceof Error
          ? `Error updating athlete ranks: ${error.message}`
          : "Failed to update athlete ranks",
    };
  }
}
