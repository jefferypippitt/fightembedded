import { NextRequest, NextResponse } from "next/server";
import { validateBearerToken, createUnauthorizedResponse } from "@/lib/bot-auth";
import { checkRateLimit } from "@/lib/rate-limit";
import prisma from "@/lib/prisma";
import { invalidateAthleteCache } from "@/lib/cache-invalidation";
import { weightClasses } from "@/data/weight-class";
import { z } from "zod";

// Get all valid weight division names
const validWeightDivisions = [
  ...weightClasses.men.map((d) => `Men's ${d.name}`),
  ...weightClasses.women.map((d) => `Women's ${d.name}`),
];

const statsUpdateSchema = z.object({
  // Stats fields
  wins: z.number().int().nonnegative().optional(),
  losses: z.number().int().nonnegative().optional(),
  draws: z.number().int().nonnegative().optional(),
  winsByKo: z.number().int().nonnegative().optional(),
  winsBySubmission: z.number().int().nonnegative().optional(),
  followers: z.number().int().nonnegative().optional(),
  // Ranking fields
  rank: z.number().int().nonnegative().optional(),
  poundForPoundRank: z.number().int().nonnegative().optional(),
  // Other updatable fields
  age: z.number().int().positive().optional(),
  weightDivision: z.enum(validWeightDivisions as [string, ...string[]]).optional(),
  retired: z.boolean().optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided" }
);

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Validate bearer token
  if (!validateBearerToken(request)) {
    return createUnauthorizedResponse();
  }

  // Rate limiting: 30 requests per minute
  const { rateLimited, headers: rateLimitHeaders } = await checkRateLimit(
    request,
    { limit: 30, window: 60 }
  );

  if (rateLimited) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please try again later." },
      { status: 429, headers: rateLimitHeaders }
    );
  }

  try {
    const { id } = await params;
    const body = await request.json();

    // Validate request body
    const validationResult = statsUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: validationResult.error.errors,
        },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    const updateData = validationResult.data;

    // Get current athlete to determine what changed
    const currentAthlete = await prisma.athlete.findUnique({
      where: { id },
      select: {
        losses: true,
        followers: true,
        weightDivision: true,
        retired: true,
        rank: true,
        poundForPoundRank: true,
      },
    });

    if (!currentAthlete) {
      return NextResponse.json(
        { error: "Athlete not found" },
        { status: 404, headers: rateLimitHeaders }
      );
    }

    // If athlete is being marked as retired, clear their ranks
    const isBeingMarkedRetired = 
      !currentAthlete.retired && updateData.retired === true;
    
    const finalData = {
      ...updateData,
      rank: isBeingMarkedRetired ? 0 : updateData.rank,
      poundForPoundRank: isBeingMarkedRetired ? 0 : updateData.poundForPoundRank,
    };

    // Update athlete
    const updatedAthlete = await prisma.athlete.update({
      where: { id },
      data: finalData,
    });

    // Determine what changed for intelligent cache invalidation
    const lossesChanged =
      updateData.losses !== undefined &&
      updateData.losses !== currentAthlete.losses;
    const followersChanged =
      updateData.followers !== undefined &&
      updateData.followers !== currentAthlete.followers;
    const rankChanged =
      updateData.rank !== undefined &&
      updateData.rank !== currentAthlete.rank;
    const p4pRankChanged =
      updateData.poundForPoundRank !== undefined &&
      updateData.poundForPoundRank !== currentAthlete.poundForPoundRank;
    const retiredStatusChanged =
      updateData.retired !== undefined &&
      updateData.retired !== currentAthlete.retired;
    const divisionChanged =
      updateData.weightDivision !== undefined &&
      updateData.weightDivision !== currentAthlete.weightDivision;

    const finalRetired = updateData.retired ?? currentAthlete.retired ?? false;
    const finalLosses = updateData.losses ?? currentAthlete.losses;
    const finalRank = finalData.rank ?? currentAthlete.rank ?? 0;
    const finalP4PRank = finalData.poundForPoundRank ?? currentAthlete.poundForPoundRank ?? 0;

    const isUndefeated = finalLosses === 0;
    const isChampion = finalRank === 1;
    const hasP4PRank = finalP4PRank > 0;

    // Invalidate relevant caches
    invalidateAthleteCache({
      athleteId: id,
      isChampion,
      isUndefeated,
      isRetired: finalRetired,
      hasP4PRank,
      lossesChanged,
      followersChanged,
      rankChanged,
      p4pRankChanged,
      retiredStatusChanged,
      divisionChanged,
      weightDivision: currentAthlete.weightDivision,
      newWeightDivision: updateData.weightDivision,
    });

    return NextResponse.json(
      {
        message: "Athlete updated successfully",
        athlete: updatedAthlete,
      },
      { headers: rateLimitHeaders }
    );
  } catch (error) {
    console.error("Error updating athlete:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: rateLimitHeaders }
    );
  }
}
