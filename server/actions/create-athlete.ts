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

export async function createAthlete(formData: FormData): Promise<ActionResponse> {
  try {
    await checkAuth();
    const rawData = Object.fromEntries(formData.entries());

    const data: AthleteInput = {
      name: String(rawData.name),
      gender: rawData.gender as "MALE" | "FEMALE",
      weightDivision: String(rawData.weightDivision),
      country: String(rawData.country),
      age: Number(rawData.age),
      wins: Number(rawData.wins),
      losses: Number(rawData.losses),
      draws: Number(rawData.draws),
      koRate: Number(rawData.koRate),
      submissionRate: Number(rawData.submissionRate),
      followers: Number(rawData.followers),
    };

    const validatedData = athleteSchema.parse(data);
    const athlete = await prisma.athlete.create({
      data: validatedData,
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
