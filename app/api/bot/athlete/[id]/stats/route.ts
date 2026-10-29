import { NextRequest, NextResponse } from "next/server";
import { validateBearerToken, createUnauthorizedResponse } from "@/lib/bot-auth";
import { checkRateLimit } from "@/lib/rate-limit";
import prisma from "@/lib/prisma";
import { invalidateAthleteCache } from "@/lib/cache-invalidation";
import { z } from "zod";

const statsUpdateSchema = z.object({
  wins: z.number().int().nonnegative().optional(),
  losses: z.number().int().nonnegative().optional(),
  draws: z.number().int().nonnegative().optional(),
  winsByKo: z.number().int().nonnegative().optional(),
  winsBySubmission: z.number().int().nonnegative().optional(),
  followers: z.number().int().nonnegative().optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one stat field must be provided" }
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

    const statsData = validationResult.data;

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

    // Update athlete stats
    const updatedAthlete = await prisma.athlete.update({
      where: { id },
      data: statsData,
    });

    // Determine what changed for intelligent cache invalidation
    const lossesChanged =
      statsData.losses !== undefined &&
      statsData.losses !== currentAthlete.losses;
    const followersChanged =
      statsData.followers !== undefined &&
      statsData.followers !== currentAthlete.followers;
    const isUndefeated =
      (statsData.losses ?? currentAthlete.losses) === 0;
    const isChampion = currentAthlete.rank === 1;
    const hasP4PRank = (currentAthlete.poundForPoundRank ?? 0) > 0;

    // Invalidate relevant caches
    invalidateAthleteCache({
      athleteId: id,
      isChampion,
      isUndefeated,
      isRetired: currentAthlete.retired ?? false,
      hasP4PRank,
      lossesChanged,
      followersChanged,
      weightDivision: currentAthlete.weightDivision,
    });

    return NextResponse.json(
      {
        message: "Athlete stats updated successfully",
        athlete: updatedAthlete,
      },
      { headers: rateLimitHeaders }
    );
  } catch (error) {
    console.error("Error updating athlete stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: rateLimitHeaders }
    );
  }
}
