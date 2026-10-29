import { NextRequest, NextResponse } from "next/server";
import { validateBearerToken, createUnauthorizedResponse } from "@/lib/bot-auth";
import { checkRateLimit } from "@/lib/rate-limit";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
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
    const { name } = await params;
    const decodedName = decodeURIComponent(name);

    // Search for athlete by name (case-insensitive partial match)
    const athletes = await prisma.athlete.findMany({
      where: {
        name: {
          contains: decodedName,
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
