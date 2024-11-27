"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { athleteSchema } from "@/schemas/athlete";
import { z } from "zod";
import { AthleteInput, ActionResponse } from "@/types/athlete";

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
    };

    const validatedData = athleteSchema.parse(data);
    const athlete = await prisma.athlete.create({
      data: {
        ...validatedData,
        rank: validatedData.rank ?? 0,
        poundForPoundRank: validatedData.poundForPoundRank ?? 0,
      },
    });

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
