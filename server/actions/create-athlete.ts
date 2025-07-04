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
      rank: validatedData.retired ? 0 : (validatedData.rank ?? 0),
      poundForPoundRank: validatedData.retired ? 0 : (validatedData.poundForPoundRank ?? 0),
    };
    
    const athlete = await prisma.athlete.create({
      data: finalData,
    }) as Athlete;

    // Revalidate cache tags to immediately update data
    revalidateTag('all-athletes');
    revalidateTag('athletes-by-division');
    revalidateTag('division-athletes');
    revalidateTag('homepage');
    
    if (validatedData.rank === 1) {
      revalidateTag('champions');
    }
    
    if (validatedData.losses === 0) {
      revalidateTag('undefeated-athletes');
    }
    
    if (validatedData.retired) {
      revalidateTag('retired-athletes');
    }
    
    if (validatedData.poundForPoundRank > 0) {
      revalidateTag('p4p-rankings');
    }

    // Revalidate paths
    revalidatePath("/");
    revalidatePath("/athletes");
    if (validatedData.retired) {
      revalidatePath("/retired");
    }
    revalidatePath("/rankings/divisions");
    revalidatePath("/rankings/popularity");
    revalidatePath(`/division/${encodeURIComponent(validatedData.weightDivision)}`, "page");
    revalidatePath("/dashboard/athletes");

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
