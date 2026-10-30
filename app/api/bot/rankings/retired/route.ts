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
  buildRetiredOrder,
  diffRankChanges,
  retiredOrderBodySchema,
} from "@/lib/rankings";

// Same order as the public /retired page
function findRetiredAthletes() {
  return prisma.athlete.findMany({
    where: { retired: true },
    orderBy: [{ rank: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      rank: true,
      weightDivision: true,
    },
  });
}

export async function GET(request: NextRequest) {
  if (!validateBearerToken(request)) {
    return createUnauthorizedResponse();
  }

  const { rateLimited, headers: rateLimitHeaders } = await checkRateLimit(
    request,
    { limit: 60, window: 60 }
  );

  if (rateLimited) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please try again later." },
      { status: 429, headers: rateLimitHeaders }
    );
  }

  try {
    const athletes = await findRetiredAthletes();

    return NextResponse.json(
      {
        count: athletes.length,
        athletes,
      },
      { headers: rateLimitHeaders }
    );
  } catch (error) {
    console.error("Error fetching retired order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: rateLimitHeaders }
    );
  }
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

    const parsed = retiredOrderBodySchema.safeParse(parsedBody.body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: parsed.error.errors,
        },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    const { athleteIds, dryRun = false } = parsed.data;

    const retiredAthletes = await findRetiredAthletes();
    const { errors, rankings } = buildRetiredOrder(retiredAthletes, athleteIds);

    if (errors.length > 0) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: errors.map((message) => ({ message })),
        },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    const changes = diffRankChanges(retiredAthletes, rankings);

    if (dryRun) {
      return NextResponse.json(
        { dryRun: true, changes },
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

      for (const change of changes) {
        invalidateAthleteCache({
          athleteId: change.athleteId,
          isRetired: true,
          retiredOrderChanged: true,
        });
      }
    }

    return NextResponse.json(
      {
        message: "Retired order updated successfully",
        updated: changes.length,
        changes,
      },
      { headers: rateLimitHeaders }
    );
  } catch (error) {
    console.error("Error updating retired order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: rateLimitHeaders }
    );
  }
}
