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

export async function createAthlete(
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
    const hasP4PRank = validatedData.poundForPoundRank > 0;

    // Always revalidate basic athlete data
    revalidateTag("all-athletes");
    revalidateTag("all-athletes-data"); // For the athletes page cache
    revalidateTag("athletes-page"); // For the athletes page cache
    revalidateTag("athletes-by-division");
    revalidateTag("division-athletes");
    revalidateTag("athletes"); // For the division page cache
    revalidateTag("homepage"); // For the athletes page cache
    revalidateTag("top-20-athletes"); // Always revalidate popularity chart
    revalidateTag("top-5-athletes"); // Always revalidate top 5 athletes chart

    // Only revalidate image-related caches if athlete has an image
    if (hasImage) {
      revalidateTag("athlete-images");
      console.log("🖼️ New athlete with image - revalidating image caches");
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
