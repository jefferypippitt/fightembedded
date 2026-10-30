import { NextRequest, NextResponse } from "next/server";
import { validateBearerToken, createUnauthorizedResponse } from "@/lib/bot-auth";
import { checkRateLimit } from "@/lib/rate-limit";
import prisma from "@/lib/prisma";
import { invalidateAthleteCache } from "@/lib/cache-invalidation";
import {
  DIVISION_MAX_RANK,
  diffRankChanges,
  divisionRankingsBodySchema,
  divisionStartRank,
  validateDivisionRankingAthletes,
  validateRankingAssignments,
} from "@/lib/rankings";

const athleteSelect = {
  id: true,
  name: true,
  retired: true,
  gender: true,
  weightDivision: true,
  rank: true,
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
    const body = await request.json();
    const parsed = divisionRankingsBodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: parsed.error.errors,
        },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    const {
      weightDivision,
      rankings,
      dryRun = false,
      vacantChampion = false,
    } = parsed.data;

    const assignmentErrors = validateRankingAssignments(rankings, {
      maxRank: DIVISION_MAX_RANK,
      startRank: divisionStartRank(vacantChampion),
      vacantChampion,
    });
    if (assignmentErrors.length > 0) {
      return validationError(assignmentErrors, rateLimitHeaders);
    }

    const athletes = await prisma.athlete.findMany({
      where:
        rankings.length === 0
          ? { weightDivision }
          : {
              OR: [
                { weightDivision },
                { id: { in: rankings.map((entry) => entry.athleteId) } },
              ],
            },
      select: athleteSelect,
    });

    const memberErrors = validateDivisionRankingAthletes(
      rankings,
      athletes,
      weightDivision
    );
    if (memberErrors.length > 0) {
      return validationError(memberErrors, rateLimitHeaders);
    }

    const changes = diffRankChanges(
      athletes
        .filter((athlete) => athlete.weightDivision === weightDivision)
        .map((athlete) => ({
          id: athlete.id,
          name: athlete.name,
          rank: athlete.rank,
        })),
      rankings
    );

    if (dryRun) {
      return NextResponse.json(
        {
          dryRun: true,
          weightDivision,
          vacantChampion,
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
            data: { rank: change.after },
          })
        )
      );

      const championAffected = changes.some(
        (change) => change.before === 1 || change.after === 1
      );
      for (const change of changes) {
        invalidateAthleteCache({
          athleteId: change.athleteId,
          rankChanged: true,
          isChampion: championAffected,
          weightDivision,
        });
      }
    }

    return NextResponse.json(
      {
        message: "Division rankings updated successfully",
        weightDivision,
        vacantChampion,
        updated: changes.length,
        changes,
      },
      { headers: rateLimitHeaders }
    );
  } catch (error) {
    console.error("Error updating division rankings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: rateLimitHeaders }
    );
  }
}
