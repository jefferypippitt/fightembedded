"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { athleteSchema } from "@/schemas/athlete";
import { z } from "zod";
import { AthleteInput, ActionResponse, Athlete } from "@/types/athlete";
import { revalidatePath, revalidateTag } from "next/cache";

async function checkAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
}

export async function updateAthlete(
  id: string,
  formData: FormData
): Promise<ActionResponse> {
  try {
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
    revalidateTag("division-athletes"); // Always revalidate division athletes cache
    revalidateTag("top-20-athletes"); // Always revalidate popularity chart
    revalidateTag("top-5-athletes"); // Always revalidate top 5 athletes chart
    revalidateTag("athletes-page"); // Ensure dashboard and main athletes page are up to date
    revalidateTag("all-athletes-data"); // Ensure all cached athlete data is up to date
    revalidateTag("athletes"); // For the division page cache
    revalidateTag("homepage"); // For the athletes page cache

    // Only revalidate image-related caches if image actually changed
    if (imageChanged) {
      revalidateTag("athlete-images");
    }

    // Division change handling
    if (divisionChanged) {
      // Division changed - additional handling if needed
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
      // Convert division name to proper slug format
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

export async function updateAthleteStatus(
  athleteId: string,
  retired: boolean
): Promise<Athlete> {
  try {
    // Get athlete data before update to know the division
    const currentAthlete = await prisma.athlete.findUnique({
      where: { id: athleteId },
      select: { weightDivision: true },
    });

    const updatedAthlete = await prisma.athlete.update({
      where: { id: athleteId },
      data: { retired },
    });

    // Revalidate cache tags
    revalidateTag("all-athletes");
    revalidateTag("athlete-by-id");
    revalidateTag("retired-athletes");
    revalidateTag("division-athletes"); // Always revalidate division athletes cache
    revalidateTag("athletes"); // For the division page cache
    revalidateTag("homepage"); // For the athletes page cache

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
