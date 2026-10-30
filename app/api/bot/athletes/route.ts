import { NextRequest, NextResponse } from "next/server";
import { validateBearerToken, createUnauthorizedResponse } from "@/lib/bot-auth";
import { checkRateLimit } from "@/lib/rate-limit";
import prisma from "@/lib/prisma";
import { invalidateAthleteCreatedCache } from "@/lib/cache-invalidation";
import { hasForbiddenRankFields } from "@/lib/rankings";
import {
  botAthleteCreateSchema,
  RANK_FIELDS_ON_CREATE_ERROR,
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
    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get("name");

    if (!name) {
      return NextResponse.json(
        { error: "Missing 'name' query parameter" },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    // Search for athlete by name (case-insensitive partial match)
    const athletes = await prisma.athlete.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
      take: 10, // Limit to 10 results
    });

    if (athletes.length === 0) {
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
    const body = await request.json();

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

    // Reject duplicates by exact name (case-insensitive)
    const existingAthlete = await prisma.athlete.findFirst({
      where: {
        name: {
          equals: athleteData.name,
          mode: "insensitive",
        },
      },
      select: { id: true, name: true },
    });

    if (existingAthlete) {
      return NextResponse.json(
        {
          error: "An athlete with this name already exists",
          id: existingAthlete.id,
          name: existingAthlete.name,
        },
        { status: 409, headers: rateLimitHeaders }
      );
    }

    // New athletes always start unranked
    const athlete = await prisma.athlete.create({
      data: {
        ...athleteData,
        rank: 0,
        poundForPoundRank: 0,
      },
    });

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
