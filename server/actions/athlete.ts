"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { athleteRankUpdatesSchema } from "@/schemas/athlete";
import { z } from "zod";
import {
  ActionResponse,
  Athlete,
} from "@/types/athlete";
import { revalidatePath, revalidateTag, cacheLife, cacheTag } from "next/cache";
import { weightClasses } from "@/data/weight-class";
import { getRateLimitIdentifier, rateLimit } from "@/lib/rate-limit";
import { isUnauthorizedError } from "@/lib/action-errors";
import { athleteInputFromFormData } from "@/lib/athlete-form-data";

// Authentication helper
const checkAuth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
};

// Get single athlete by ID (cached for public pages)
export async function getAthlete(id: string): Promise<Athlete | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("athlete-by-id");
  cacheTag(`athlete-${id}`);

  try {
    const athlete = await prisma.athlete.findUnique({
      where: { id },
    });
    return athlete;
  } catch (error) {
    console.error("Error fetching athlete:", error);
    throw new Error("Failed to fetch athlete");
  }
}

// Get single athlete by ID (for edit pages - always fresh data, no caching)
export async function getAthleteForEdit(id: string): Promise<Athlete | null> {
  try {
    // Check authentication for edit pages
    await checkAuth();
    
    const athlete = await prisma.athlete.findUnique({
      where: { id },
    });
    return athlete;
  } catch (error) {
    if (isUnauthorizedError(error)) {
      throw error;
    }
    console.error("Error fetching athlete:", error);
    throw new Error("Failed to fetch athlete");
  }
}

const athleteListSelect = {
  id: true,
  name: true,
  gender: true,
  age: true,
  weightDivision: true,
  country: true,
  imageUrl: true,
  wins: true,
  losses: true,
  draws: true,
  winsByKo: true,
  winsBySubmission: true,
  followers: true,
  updatedAt: true,
  poundForPoundRank: true,
  rank: true,
  retired: true,
} as const;

// Get active athletes (for main athletes page)
export async function getAthletes(): Promise<Athlete[]> {
  "use cache";
  cacheLife("days");
  cacheTag("athletes");
  try {
    const athletes = await prisma.athlete.findMany({
      where: { retired: false },
      select: athleteListSelect,
      orderBy: [{ rank: "asc" }, { name: "asc" }],
    });

    return athletes.toSorted((a, b) => {
      if (a.rank !== null && b.rank !== null) {
        return a.rank - b.rank;
      }
      if (a.rank !== null && b.rank === null) {
        return -1;
      }
      if (a.rank === null && b.rank !== null) {
        return 1;
      }
      return a.name.localeCompare(b.name);
    }) as Athlete[];
  } catch (error) {
    console.error("Error fetching active athletes:", error);
    return [];
  }
}

// Get division athletes by slug (for division pages)
export async function getDivisionAthletes(
  slug: string
): Promise<{ name: string; weight?: number; athletes: Athlete[] } | null> {
  "use cache";
  cacheLife("days");
  cacheTag("division-athletes");
  cacheTag(`division-slug-${slug}`);

  try {
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

    const sortedAthletes = athletes.toSorted((a, b) => {
      const aRank = a.rank && a.rank > 0 ? a.rank : Infinity;
      const bRank = b.rank && b.rank > 0 ? b.rank : Infinity;

      if (aRank !== Infinity && bRank !== Infinity) {
        return aRank - bRank;
      }
      if (aRank !== Infinity && bRank === Infinity) {
        return -1;
      }
      if (aRank === Infinity && bRank !== Infinity) {
        return 1;
      }
      return a.name.localeCompare(b.name);
    });

    // Find the weight for this division
    const divisions = isWomen ? weightClasses.women : weightClasses.men;
    const divisionData = divisions.find((d) => d.name === standardDivision);

    return {
      name: fullDivisionName,
      weight: divisionData?.weight,
      athletes: sortedAthletes,
    };
  } catch (error) {
    console.error("Error fetching division athletes:", error);
    return null;
  }
}

// Get live P4P rankings (with Next.js cache and tags for proper revalidation)
export async function getP4PRankings(): Promise<{
  maleP4PRankings: Athlete[];
  femaleP4PRankings: Athlete[];
}> {
  "use cache";
  cacheLife("days");
  cacheTag("p4p-rankings-data");
  cacheTag("homepage-p4p");

  try {
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

// Get champions (separated by gender for homepage/display use)
export async function getChampions(): Promise<{
  maleChampions: Athlete[];
  femaleChampions: Athlete[];
}> {
  "use cache";
  cacheLife("days");
  cacheTag("champions-data");
  cacheTag("homepage-champions");

  try {
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
    console.error("Error fetching champions:", error);
    return { maleChampions: [], femaleChampions: [] };
  }
}

// Get retired athletes
export async function getRetiredAthletes(): Promise<Athlete[]> {
  "use cache";
  cacheLife("days");
  cacheTag("retired-athletes-data");

  try {
    const retiredAthletes = await prisma.athlete.findMany({
      where: { retired: true },
      orderBy: [
        { rank: "asc" }, // Sort by rank (retirement order from admin reorder)
        { name: "asc" }, // Then alphabetically by name
      ],
    });

    return retiredAthletes;
  } catch (error) {
    console.error("Error fetching retired athletes:", error);
    return [];
  }
}

// Create new athlete
export async function createAthlete(
  formData: FormData
): Promise<ActionResponse> {
  try {
    await checkAuth();
    
    // Rate limiting: 5 creates per minute
    const identifier = await getRateLimitIdentifier();
    const rateLimitResult = await rateLimit(`${identifier}:create-athlete`, {
      limit: 5,
      window: 60,
    });
    
    if (!rateLimitResult.success) {
      return {
        status: "error",
        message: `Rate limit exceeded. Please try again in ${Math.ceil(
          (rateLimitResult.resetAt - Date.now()) / 1000
        )} seconds.`,
      };
    }
    const validatedData = athleteInputFromFormData(formData);

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
    const hasRank = (validatedData.rank ?? 0) > 0;
    const isUndefeated = validatedData.losses === 0;
    const isRetired = validatedData.retired;
    const hasP4PRank = (validatedData.poundForPoundRank ?? 0) > 0;

    // Always revalidate basic athlete data
    revalidateTag("all-athletes", "max");
    revalidateTag("all-athletes-data", "max");
    revalidateTag("live-stats", "max");
    revalidateTag("stats", "max");
    revalidateTag("athletes-page", "max");
    revalidateTag("athletes-by-division", "max");
    revalidateTag("division-athletes", "max");
    revalidateTag("athletes", "max");
    revalidateTag("homepage", "max");
    revalidateTag("top-20-athletes", "max");
    revalidateTag("top-5-athletes", "max");

    // Only revalidate image-related caches if athlete has an image
    if (hasImage) {
      revalidateTag("athlete-images", "max");
    }

    // Only revalidate specific caches based on athlete properties
    if (isChampion) {
      revalidateTag("champions-data", "max");
      revalidateTag("homepage-champions", "max");
    }

    revalidateTag("country-stats", "max");

    if (isUndefeated) {
      revalidateTag("undefeated-athletes", "max");
    }

    if (isRetired) {
      revalidateTag("retired-athletes-data", "max");
      revalidateTag("retired-page", "max");
    }

    if (hasP4PRank) {
      revalidateTag("p4p-rankings-data", "max");
      revalidateTag("homepage-p4p", "max");
    }

    // Revalidate rankings pages if athlete has rank
    if (hasRank || hasP4PRank) {
      revalidatePath("/rankings/divisions", "page");
    }

    // Always revalidate popularity rankings (based on followers)
    revalidatePath("/rankings/popularity", "page");
    revalidatePath("/rankings/all-time", "page");

    // Only revalidate homepage if athlete affects homepage sections
    if (isChampion || hasP4PRank) {
      revalidateTag("homepage", "max");
      revalidateTag("homepage-stats", "max");
      revalidatePath("/", "page");
    }

    // Revalidate paths (only for dynamic routes that need it)
    if (isRetired) {
      revalidatePath("/retired", "page");
    }

    // Revalidate main pages
    revalidatePath("/athletes", "page");
    revalidatePath("/dashboard/athletes/new", "page"); // Clear router cache for new form

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

    if (isUnauthorizedError(error)) {
      return { status: "error", message: "Unauthorized" };
    }

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
    await checkAuth();
    
    // Rate limiting: 10 updates per minute
    const identifier = await getRateLimitIdentifier();
    const rateLimitResult = await rateLimit(`${identifier}:update-athlete`, {
      limit: 10,
      window: 60,
    });
    
    if (!rateLimitResult.success) {
      return {
        status: "error",
        message: `Rate limit exceeded. Please try again in ${Math.ceil(
          (rateLimitResult.resetAt - Date.now()) / 1000
        )} seconds.`,
      };
    }
    const validatedData = athleteInputFromFormData(formData);

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

    // Only clear ranks when athlete is BEING marked as retired (not already retired)
    // Handle both false and null (some legacy data might have null)
    const isCurrentlyActive = currentAthlete?.retired === false || currentAthlete?.retired === null;
    const isBeingMarkedRetired = isCurrentlyActive && validatedData.retired === true;
    
    const finalData = {
      ...validatedData,
      rank: isBeingMarkedRetired ? 0 : validatedData.rank ?? 0,
      poundForPoundRank: isBeingMarkedRetired
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
    revalidateTag("all-athletes", "max");
    revalidateTag("athlete-by-id", "max");
    revalidateTag("live-stats", "max");
    revalidateTag("stats", "max");
    revalidateTag(`athlete-${id}`, "max");
    revalidateTag(`athlete-edit-${id}`, "max"); // Invalidate edit cache
    revalidateTag("athletes-by-division", "max");
    revalidateTag("division-athletes", "max");
    revalidateTag("top-20-athletes", "max");
    revalidateTag("top-5-athletes", "max");
    revalidateTag("athletes-page", "max");
    revalidateTag("all-athletes-data", "max");
    revalidateTag("athletes", "max");
    revalidateTag("country-stats", "max");

    // Only revalidate image-related caches if image actually changed
    if (imageChanged) {
      revalidateTag("athlete-images", "max");
    }

    // Only revalidate specific caches based on what changed
    if (rankChanged || p4pRankChanged) {
      revalidateTag("p4p-rankings-data", "max");
      revalidateTag("homepage-p4p", "max");
      revalidatePath("/rankings/divisions", "page"); // Revalidate division rankings page
      if (finalData.rank === 1 || currentAthlete?.rank === 1) {
        revalidateTag("champions-data", "max");
        revalidateTag("homepage-champions", "max");
      }
    }

    // Revalidate popularity rankings if followers changed
    const followersChanged =
      currentAthlete?.followers !== validatedData.followers;
    if (followersChanged) {
      revalidatePath("/rankings/popularity", "page");
      revalidatePath("/rankings/all-time", "page");
    }

    if (retiredStatusChanged) {
      revalidatePath("/rankings/all-time", "page");
    }

    if (retiredStatusChanged) {
      revalidateTag("retired-athletes-data", "max");
      revalidateTag("retired-page", "max");
    }

    if (
      lossesChanged &&
      (finalData.losses === 0 || currentAthlete?.losses === 0)
    ) {
      revalidateTag("undefeated-athletes", "max");
    }

    // Only revalidate homepage if significant changes occurred that affect homepage sections
    if (rankChanged || p4pRankChanged || retiredStatusChanged) {
      revalidateTag("homepage", "max");
      revalidateTag("homepage-stats", "max");
      revalidatePath("/", "page");
    }

    // Only revalidate paths for dynamic routes that need it
    if (retiredStatusChanged) {
      revalidatePath("/retired", "page");
    }

    // Revalidate main pages
    revalidatePath("/athletes", "page");

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

    if (isUnauthorizedError(error)) {
      return { status: "error", message: "Unauthorized" };
    }

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

// Delete athlete
export async function deleteAthlete(id: string) {
  try {
    await checkAuth();
    
    // Rate limiting: 3 deletes per minute
    const identifier = await getRateLimitIdentifier();
    const rateLimitResult = await rateLimit(`${identifier}:delete-athlete`, {
      limit: 3,
      window: 60,
    });
    
    if (!rateLimitResult.success) {
      return {
        status: "error",
        message: `Rate limit exceeded. Please try again in ${Math.ceil(
          (rateLimitResult.resetAt - Date.now()) / 1000
        )} seconds.`,
      };
    }

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
    revalidateTag("all-athletes", "max");
    revalidateTag("all-athletes-data", "max");
    revalidateTag("live-stats", "max");
    revalidateTag("stats", "max");
    revalidateTag("athletes-page", "max");
    revalidateTag("athlete-by-id", "max");
    revalidateTag(`athlete-${id}`, "max");
    revalidateTag("athletes-by-division", "max");
    revalidateTag("division-athletes", "max");
    revalidateTag("athletes", "max");
    revalidateTag("homepage", "max");
    revalidateTag("top-20-athletes", "max");
    revalidateTag("top-5-athletes", "max");
    revalidateTag("country-stats", "max");

    if (athlete.rank === 1) {
      revalidateTag("champions-data", "max");
      revalidateTag("homepage-champions", "max");
    }

    if (athlete.losses === 0) {
      revalidateTag("undefeated-athletes", "max");
    }

    if (athlete.retired) {
      revalidateTag("retired-athletes-data", "max");
      revalidateTag("retired-page", "max");
    }

    if (athlete.poundForPoundRank && athlete.poundForPoundRank > 0) {
      revalidateTag("p4p-rankings-data", "max");
      revalidateTag("homepage-p4p", "max");
    }

    // Revalidate rankings pages if athlete has rank
    if (
      (athlete.rank && athlete.rank > 0) ||
      (athlete.poundForPoundRank && athlete.poundForPoundRank > 0)
    ) {
      revalidatePath("/rankings/divisions", "page");
    }

    // Revalidate popularity rankings (athlete had followers)
    if (athlete.followers > 0) {
      revalidatePath("/rankings/popularity", "page");
      revalidatePath("/rankings/all-time", "page");
    }

    // Only revalidate homepage if athlete affects homepage sections
    if (
      athlete.rank === 1 ||
      (athlete.poundForPoundRank && athlete.poundForPoundRank > 0)
    ) {
      revalidateTag("homepage-stats", "max");
    }

    // Revalidate paths for dynamic routes that need it
    if (athlete.retired) {
      revalidatePath("/retired", "page");
    }

    // Revalidate main pages
    revalidatePath("/athletes", "page");
    revalidatePath("/", "page"); // Homepage

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
    if (isUnauthorizedError(error)) {
      throw error;
    }
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
    await checkAuth();

    // Rate limiting: 10 rank updates per minute
    const identifier = await getRateLimitIdentifier();
    const rateLimitResult = await rateLimit(
      `${identifier}:update-athlete-ranks`,
      {
        limit: 10,
        window: 60,
      }
    );

    if (!rateLimitResult.success) {
      return {
        status: "error",
        message: `Rate limit exceeded. Please try again in ${Math.ceil(
          (rateLimitResult.resetAt - Date.now()) / 1000
        )} seconds.`,
      };
    }

    const parsed = athleteRankUpdatesSchema.safeParse(athleteRankUpdates);
    if (!parsed.success) {
      return {
        status: "error",
        message: `Validation error: ${parsed.error.errors
          .map((e) => e.message)
          .join(", ")}`,
      };
    }

    const validatedUpdates = parsed.data;

    // Update each athlete's rank(s) atomically
    await prisma.$transaction(
      validatedUpdates.map((update) => {
        const updateData: {
          rank?: number;
          poundForPoundRank?: number;
        } = {};
        if (update.rank !== undefined) updateData.rank = update.rank;
        if (update.poundForPoundRank !== undefined) {
          updateData.poundForPoundRank = update.poundForPoundRank;
        }

        return prisma.athlete.update({
          where: { id: update.id },
          data: updateData,
        });
      })
    );

    // Fetch affected athletes to get their division information for cache revalidation
    const affectedAthleteIds = validatedUpdates.map((update) => update.id);
    const affectedAthletes = await prisma.athlete.findMany({
      where: { id: { in: affectedAthleteIds } },
      select: { weightDivision: true, gender: true },
    });

    // Generate division slugs for affected divisions
    const affectedDivisions = new Set<string>();
    affectedAthletes.forEach((athlete) => {
      if (athlete.weightDivision && athlete.gender) {
        // Convert division name to slug format
        const isWomen = athlete.gender === "FEMALE";
        const divisionName = athlete.weightDivision.replace(
          /^(Men's|Women's)\s+/,
          ""
        );

        // Map division names to slugs
        const menDivisions: Record<string, string> = {
          Heavyweight: "heavyweight",
          "Light Heavyweight": "light-heavyweight",
          Middleweight: "middleweight",
          Welterweight: "welterweight",
          Lightweight: "lightweight",
          Featherweight: "featherweight",
          Bantamweight: "bantamweight",
          Flyweight: "flyweight",
        };

        const womenDivisions: Record<string, string> = {
          Featherweight: "featherweight",
          Bantamweight: "bantamweight",
          Flyweight: "flyweight",
          Strawweight: "strawweight",
        };

        const divisionMap = isWomen ? womenDivisions : menDivisions;
        const slug =
          divisionMap[divisionName] ||
          divisionName.toLowerCase().replace(/\s+/g, "-");
        const fullSlug = `${isWomen ? "women" : "men"}-${slug}`;
        affectedDivisions.add(fullSlug);
      }
    });

    // Revalidate cache tags
    revalidateTag("all-athletes", "max");
    revalidateTag("all-athletes-data", "max");
    revalidateTag("live-stats", "max");
    revalidateTag("athletes-page", "max");
    revalidateTag("athletes-by-division", "max");
    revalidateTag("division-athletes", "max");
    revalidateTag("athletes", "max");
    revalidateTag("homepage", "max");
    revalidateTag("top-20-athletes", "max");
    revalidateTag("top-5-athletes", "max");
    revalidateTag("champions-data", "max");
    revalidateTag("homepage-champions", "max");
    revalidateTag("p4p-rankings-data", "max");
    revalidateTag("homepage-p4p", "max");
    revalidateTag("retired-athletes-data", "max");
    revalidateTag("retired-page", "max");

    // Revalidate specific division cache tags
    affectedDivisions.forEach((slug) => {
      revalidateTag(`division-slug-${slug}`, "max");
      // Also revalidate the generic division tag for backward compatibility
      const divisionName = slug.split("-").slice(1).join("-");
      revalidateTag(`division-${divisionName}`, "max");
    });

    // Revalidate paths
    revalidatePath("/", "page"); // Homepage - critical for P4P rankings display
    revalidatePath("/athletes", "page");
    revalidatePath("/retired", "page");
    revalidatePath("/rankings/divisions", "page"); // Revalidate division rankings page

    // Revalidate specific division paths
    affectedDivisions.forEach((slug) => {
      revalidatePath(`/division/${slug}`, "page");
    });

    return {
      status: "success",
      message: "Athlete ranks updated successfully",
    };
  } catch (error) {
    console.error("Update athlete ranks error:", error);

    if (isUnauthorizedError(error)) {
      return { status: "error", message: "Unauthorized" };
    }

    return {
      status: "error",
      message:
        error instanceof Error
          ? `Error updating athlete ranks: ${error.message}`
          : "Failed to update athlete ranks",
    };
  }
}
