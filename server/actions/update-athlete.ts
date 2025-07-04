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

    // If athlete is being marked as retired, clear their ranks
    const finalData = {
      ...validatedData,
      rank: validatedData.retired ? 0 : (validatedData.rank ?? 0),
      poundForPoundRank: validatedData.retired ? 0 : (validatedData.poundForPoundRank ?? 0),
      retired: validatedData.retired,
    };

    const athlete = await prisma.athlete.update({
      where: { id },
      data: finalData,
    });

    // Revalidate cache tags to immediately update data
    revalidateTag('all-athletes');
    revalidateTag('athlete-by-id');
    revalidateTag('athletes-by-division');
    revalidateTag('division-athletes');
    revalidateTag('p4p-rankings');
    revalidateTag('champions');
    revalidateTag('undefeated-athletes');
    revalidateTag('retired-athletes');
    revalidateTag('homepage');

    // Revalidate paths
    revalidatePath("/");
    revalidatePath("/athletes");
    revalidatePath("/retired");
    revalidatePath(`/athlete/${id}`);
    revalidatePath("/rankings/divisions");
    revalidatePath("/rankings/popularity");
    revalidatePath("/division/[slug]", "page");
    revalidatePath("/dashboard/athletes");

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
    const updatedAthlete = await prisma.athlete.update({
      where: { id: athleteId },
      data: { retired },
    });

    // Revalidate cache tags
    revalidateTag('all-athletes');
    revalidateTag('athlete-by-id');
    revalidateTag('retired-athletes');
    
    // Revalidate paths
    revalidatePath("/retired");
    revalidatePath("/athletes");
    revalidatePath(`/athlete/${athleteId}`);

    return updatedAthlete as Athlete;
  } catch (error) {
    console.error("Error updating athlete status:", error);
    throw new Error("Failed to update athlete status");
  }
}
