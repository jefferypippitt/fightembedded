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
  P4P_MAX_RANK,
  diffRankChanges,
  p4pRankingsBodySchema,
  validateP4pRankingAthletes,
  validateRankingAssignments,
} from "@/lib/rankings";

const athleteSelect = {
  id: true,
  name: true,
  retired: true,
  gender: true,
  weightDivision: true,
  poundForPoundRank: true,
} as const;

function validationError(messages: string[], headers: Headers) {
  return NextResponse.json(
    {
      error: "Validation error",
      details: messages.map((message) => ({ message })),
    },
    { status: 400, headers }
  );
}

export async function PUT(request: NextRequest) {
  if (!validateBearerToken(request)) {
    return createUnauthorizedResponse();
  }

  const { rateLimited, headers: rateLimitHeaders } = await checkRateLimit(
    request,
    { limit: 10, window: 60 }
  );

  if (rateLimited) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please try again later." },
      { status: 429, headers: rateLimitHeaders }
    );
  }

  try {
    const parsedBody = await readJsonBody(request);
    if (!parsedBody.ok) {
      return createInvalidJsonResponse(rateLimitHeaders);
    }
    const body = parsedBody.body;
    const parsed = p4pRankingsBodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: parsed.error.errors,
        },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    const { gender, rankings, dryRun = false } = parsed.data;

    const assignmentErrors = validateRankingAssignments(rankings, {
      maxRank: P4P_MAX_RANK,
      startRank: 1,
    });
    if (assignmentErrors.length > 0) {
      return validationError(assignmentErrors, rateLimitHeaders);
    }

    const athletes = await prisma.athlete.findMany({
      where:
        rankings.length === 0
          ? { gender }
          : {
              OR: [
                { gender },
                { id: { in: rankings.map((entry) => entry.athleteId) } },
              ],
            },
      select: athleteSelect,
    });

    const memberErrors = validateP4pRankingAthletes(rankings, athletes, gender);
    if (memberErrors.length > 0) {
      return validationError(memberErrors, rateLimitHeaders);
    }

    const changes = diffRankChanges(
      athletes
        .filter((athlete) => athlete.gender === gender)
        .map((athlete) => ({
          id: athlete.id,
          name: athlete.name,
          rank: athlete.poundForPoundRank,
        })),
      rankings
    );

    if (dryRun) {
      return NextResponse.json(
        {
          dryRun: true,
          gender,
          changes,
        },
        { headers: rateLimitHeaders }
      );
    }

    if (changes.length > 0) {
      await prisma.$transaction(
        changes.map((change) =>
          prisma.athlete.update({
            where: { id: change.athleteId },
            data: { poundForPoundRank: change.after },
          })
        )
      );

      const divisionByAthleteId = new Map(
        athletes.map((athlete) => [athlete.id, athlete.weightDivision])
      );
      for (const change of changes) {
        invalidateAthleteCache({
          athleteId: change.athleteId,
          p4pRankChanged: true,
          hasP4PRank: true,
          weightDivision: divisionByAthleteId.get(change.athleteId),
        });
      }
    }

    return NextResponse.json(
      {
        message: "Pound-for-pound rankings updated successfully",
        gender,
        updated: changes.length,
        changes,
      },
      { headers: rateLimitHeaders }
    );
  } catch (error) {
    console.error("Error updating pound-for-pound rankings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: rateLimitHeaders }
    );
  }
}
