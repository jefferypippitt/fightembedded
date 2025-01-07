"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { athleteSchema } from "@/schemas/athlete";
import { z } from "zod";
import { AthleteInput, ActionResponse, Athlete } from "@/types/athlete";
import { revalidatePath } from "next/cache";

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

    const athlete = await prisma.athlete.update({
      where: { id },
      data: {
        ...validatedData,
        rank: validatedData.rank ?? 0,
        poundForPoundRank: validatedData.poundForPoundRank ?? 0,
        retired: validatedData.retired,
      },
    });

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

    revalidatePath("/retired");
    revalidatePath("/athletes");
    revalidatePath(`/athlete/${athleteId}`);

    return updatedAthlete as Athlete;
  } catch (error) {
    console.error("Error updating athlete status:", error);
    throw new Error("Failed to update athlete status");
  }
}
