import { NextRequest, NextResponse } from "next/server";
import {
  validateBearerToken,
  createUnauthorizedResponse,
  readJsonBody,
  createInvalidJsonResponse,
} from "@/lib/bot-auth";
import { checkRateLimit } from "@/lib/rate-limit";
import prisma from "@/lib/prisma";
import { invalidateAthleteCache } from "@/lib/cache-invalidation";
import {
  hasForbiddenRankFields,
  RANK_FIELDS_MOVED_ERROR,
} from "@/lib/rankings";
import {
  botAthleteUpdateSchema,
  DIVISION_GENDER_MISMATCH_ERROR,
  divisionMatchesGender,
} from "@/lib/bot-athletes";

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
    const parsedBody = await readJsonBody(request);
    if (!parsedBody.ok) {
      return createInvalidJsonResponse(rateLimitHeaders);
    }
    const body = parsedBody.body;

    if (hasForbiddenRankFields(body)) {
      return NextResponse.json(
        { error: RANK_FIELDS_MOVED_ERROR },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    // Validate request body
    const validationResult = botAthleteUpdateSchema.safeParse(body);
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
        name: true,
        gender: true,
        imageUrl: true,
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

    const finalGender = updateData.gender ?? currentAthlete.gender;
    const finalDivision =
      updateData.weightDivision ?? currentAthlete.weightDivision;

    if (
      (updateData.gender !== undefined ||
        updateData.weightDivision !== undefined) &&
      !divisionMatchesGender(finalGender, finalDivision)
    ) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: [
            {
              message: DIVISION_GENDER_MISMATCH_ERROR,
              path: ["weightDivision"],
            },
          ],
        },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    // A pound-for-pound rank belongs to one gender's board
    if (
      updateData.gender !== undefined &&
      updateData.gender !== currentAthlete.gender &&
      currentAthlete.poundForPoundRank > 0
    ) {
      return NextResponse.json(
        {
          error:
            "Cannot change gender while the athlete holds a pound-for-pound rank. Remove them from the board with PUT /api/bot/rankings/p4p first.",
        },
        { status: 409, headers: rateLimitHeaders }
      );
    }

    // Names are unique (case-insensitive)
    if (
      updateData.name !== undefined &&
      updateData.name.toLowerCase() !== currentAthlete.name.toLowerCase()
    ) {
      const nameTaken = await prisma.athlete.findFirst({
        where: {
          id: { not: id },
          name: { equals: updateData.name, mode: "insensitive" },
        },
        select: { id: true, name: true },
      });

      if (nameTaken) {
        return NextResponse.json(
          {
            error: "An athlete with this name already exists",
            id: nameTaken.id,
            name: nameTaken.name,
          },
          { status: 409, headers: rateLimitHeaders }
        );
      }
    }

    // If athlete is being marked as retired, clear their ranks
    const isBeingMarkedRetired =
      !currentAthlete.retired && updateData.retired === true;

    const finalData = isBeingMarkedRetired
      ? { ...updateData, rank: 0, poundForPoundRank: 0 }
      : updateData;

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
    const rankChanged = isBeingMarkedRetired && currentAthlete.rank !== 0;
    const p4pRankChanged =
      isBeingMarkedRetired && currentAthlete.poundForPoundRank !== 0;
    const retiredStatusChanged =
      updateData.retired !== undefined &&
      updateData.retired !== currentAthlete.retired;
    const divisionChanged =
      updateData.weightDivision !== undefined &&
      updateData.weightDivision !== currentAthlete.weightDivision;
    const imageChanged =
      updateData.imageUrl !== undefined &&
      updateData.imageUrl !== (currentAthlete.imageUrl ?? "");
    const finalImageUrl = updateData.imageUrl ?? currentAthlete.imageUrl;

    const finalRetired = updateData.retired ?? currentAthlete.retired ?? false;
    const finalLosses = updateData.losses ?? currentAthlete.losses;
    const finalRank = isBeingMarkedRetired ? 0 : currentAthlete.rank;
    const finalP4PRank = isBeingMarkedRetired ? 0 : currentAthlete.poundForPoundRank;

    const isUndefeated = finalLosses === 0;
    const isChampion =
      finalRank === 1 || (isBeingMarkedRetired && currentAthlete.rank === 1);
    const hasP4PRank =
      finalP4PRank > 0 ||
      (isBeingMarkedRetired && currentAthlete.poundForPoundRank > 0);

    // Invalidate relevant caches
    invalidateAthleteCache({
      athleteId: id,
      hasImage: !!finalImageUrl,
      imageChanged,
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
