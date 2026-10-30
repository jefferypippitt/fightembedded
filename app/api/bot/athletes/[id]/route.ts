import { NextRequest, NextResponse } from "next/server";
import { validateBearerToken, createUnauthorizedResponse } from "@/lib/bot-auth";
import { checkRateLimit } from "@/lib/rate-limit";
import prisma from "@/lib/prisma";
import { invalidateAthleteDeletedCache } from "@/lib/cache-invalidation";
import { isRankedAthlete } from "@/lib/bot-athletes";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Validate bearer token
  if (!validateBearerToken(request)) {
    return createUnauthorizedResponse();
  }

  // Rate limiting: 10 requests per minute
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
    const { id } = await params;
    const force = request.nextUrl.searchParams.get("force") === "true";

    const athlete = await prisma.athlete.findUnique({
      where: { id },
    });

    if (!athlete) {
      return NextResponse.json(
        { error: "Athlete not found" },
        { status: 404, headers: rateLimitHeaders }
      );
    }

    // Deleting a ranked athlete leaves a gap in a rankings board
    if (isRankedAthlete(athlete) && !force) {
      return NextResponse.json(
        {
          error:
            "Athlete is ranked. Remove them from the rankings with PUT /api/bot/rankings/division or PUT /api/bot/rankings/p4p first, or pass ?force=true to delete anyway.",
          id: athlete.id,
          name: athlete.name,
          rank: athlete.rank,
          poundForPoundRank: athlete.poundForPoundRank,
        },
        { status: 409, headers: rateLimitHeaders }
      );
    }

    await prisma.athlete.delete({
      where: { id },
    });

    // Same invalidation as the dashboard deleteAthlete action
    invalidateAthleteDeletedCache(athlete);

    return NextResponse.json(
      {
        message: "Athlete deleted successfully",
        athlete: {
          id: athlete.id,
          name: athlete.name,
          weightDivision: athlete.weightDivision,
          rank: athlete.rank,
          poundForPoundRank: athlete.poundForPoundRank,
        },
      },
      { headers: rateLimitHeaders }
    );
  } catch (error) {
    console.error("Error deleting athlete:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: rateLimitHeaders }
    );
  }
}
