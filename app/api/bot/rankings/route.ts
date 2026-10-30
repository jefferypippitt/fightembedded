import { connection, NextRequest, NextResponse } from "next/server";
import { validateBearerToken, createUnauthorizedResponse } from "@/lib/bot-auth";
import { checkRateLimit } from "@/lib/rate-limit";
import prisma from "@/lib/prisma";
import { parseRankingsQuery } from "@/lib/rankings";

function uncachedHeaders(rateLimitHeaders: Headers): Headers {
  const headers = new Headers(rateLimitHeaders);
  headers.set("Cache-Control", "no-store");
  return headers;
}

export async function GET(request: NextRequest) {
  // Rankings are read live for the bot. Do not serve a cached response.
  await connection();

  if (!validateBearerToken(request)) {
    return createUnauthorizedResponse();
  }

  const { rateLimited, headers: rateLimitHeaders } = await checkRateLimit(
    request,
    { limit: 60, window: 60 }
  );
  const headers = uncachedHeaders(rateLimitHeaders);

  if (rateLimited) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please try again later." },
      { status: 429, headers }
    );
  }

  const parsed = parseRankingsQuery({
    division: request.nextUrl.searchParams.get("division"),
    p4p: request.nextUrl.searchParams.get("p4p"),
  });

  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400, headers });
  }

  try {
    switch (parsed.kind) {
      case "division": {
        const rankings = await prisma.athlete.findMany({
          where: {
            weightDivision: parsed.weightDivision,
            retired: { not: true },
            rank: { gt: 0 },
          },
          select: { id: true, name: true, rank: true },
          orderBy: [{ rank: "asc" }, { name: "asc" }],
        });

        return NextResponse.json(
          {
            weightDivision: parsed.weightDivision,
            count: rankings.length,
            rankings,
          },
          { headers }
        );
      }
      case "p4p": {
        const rankings = await prisma.athlete.findMany({
          where: {
            gender: parsed.gender,
            retired: { not: true },
            poundForPoundRank: { gt: 0 },
          },
          select: { id: true, name: true, poundForPoundRank: true },
          orderBy: [{ poundForPoundRank: "asc" }, { name: "asc" }],
        });

        return NextResponse.json(
          {
            gender: parsed.gender,
            count: rankings.length,
            rankings,
          },
          { headers }
        );
      }
      default: {
        const exhaustive: never = parsed;
        throw new Error(`Unhandled rankings query: ${JSON.stringify(exhaustive)}`);
      }
    }
  } catch (error) {
    console.error("Error fetching rankings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers }
    );
  }
}
