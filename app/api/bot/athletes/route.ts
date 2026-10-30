import { NextRequest, NextResponse } from "next/server";
import {
  validateBearerToken,
  createUnauthorizedResponse,
  readJsonBody,
  createInvalidJsonResponse,
} from "@/lib/bot-auth";
import { checkRateLimit } from "@/lib/rate-limit";
import prisma from "@/lib/prisma";
import { invalidateAthleteCreatedCache } from "@/lib/cache-invalidation";
import { hasForbiddenRankFields } from "@/lib/rankings";
import { findAthleteWithName, lockAthleteName } from "@/lib/bot-duplicates";
import {
  botAthleteCreateSchema,
  parseAthleteListQuery,
  RANK_FIELDS_ON_CREATE_ERROR,
  sortByDivisionRank,
} from "@/lib/bot-athletes";

export async function GET(request: NextRequest) {
  // Validate bearer token
  if (!validateBearerToken(request)) {
    return createUnauthorizedResponse();
  }

  // Rate limiting: 60 requests per minute
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
    const query = parseAthleteListQuery(request.nextUrl.searchParams);

    if (!query.ok) {
      return NextResponse.json(
        { error: query.error },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    const { name, weightDivision, retired } = query;

    const found = await prisma.athlete.findMany({
      where: {
        // Case-insensitive partial match
        ...(name && { name: { contains: name, mode: "insensitive" } }),
        ...(weightDivision && { weightDivision }),
        // retired is nullable; treat null as active
        ...(retired === true && { retired: true }),
        ...(retired === false && { retired: { not: true } }),
      },
      orderBy: { name: "asc" },
      // Name searches stay short; a division listing returns the whole division
      take: weightDivision ? 200 : 10,
    });

    const athletes = weightDivision ? sortByDivisionRank(found) : found;

    // A name search that finds nothing is a 404; an empty division is just empty
    if (name && athletes.length === 0) {
      return NextResponse.json(
        { error: "Athlete not found" },
        { status: 404, headers: rateLimitHeaders }
      );
    }

    return NextResponse.json(
      {
        count: athletes.length,
        athletes,
      },
      { headers: rateLimitHeaders }
    );
  } catch (error) {
    console.error("Error looking up athlete:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: rateLimitHeaders }
    );
  }
}

export async function POST(request: NextRequest) {
  // Validate bearer token
  if (!validateBearerToken(request)) {
    return createUnauthorizedResponse();
  }

  // Rate limiting: 20 requests per minute
  const { rateLimited, headers: rateLimitHeaders } = await checkRateLimit(
    request,
    { limit: 20, window: 60 }
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

    if (hasForbiddenRankFields(body)) {
      return NextResponse.json(
        { error: RANK_FIELDS_ON_CREATE_ERROR },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    // Validate request body
    const validationResult = botAthleteCreateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: validationResult.error.errors,
        },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    const athleteData = validationResult.data;

    // Reject duplicates by exact name (case-insensitive), locked so two
    // concurrent creates of the same name cannot both succeed
    const result = await prisma.$transaction(async (tx) => {
      await lockAthleteName(tx, athleteData.name);

      const existing = await findAthleteWithName(tx, athleteData.name);
      if (existing) {
        return { existing };
      }

      // New athletes always start unranked
      const created = await tx.athlete.create({
        data: {
          ...athleteData,
          rank: 0,
          poundForPoundRank: 0,
        },
      });
      return { created };
    });

    if (result.existing) {
      return NextResponse.json(
        {
          error: "An athlete with this name already exists",
          id: result.existing.id,
          name: result.existing.name,
        },
        { status: 409, headers: rateLimitHeaders }
      );
    }

    const athlete = result.created;

    // Same invalidation as the dashboard createAthlete action
    invalidateAthleteCreatedCache(athlete);

    return NextResponse.json(
      {
        message: "Athlete created successfully",
        athlete,
      },
      { status: 201, headers: rateLimitHeaders }
    );
  } catch (error) {
    console.error("Error creating athlete:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: rateLimitHeaders }
    );
  }
}
