import { NextRequest, NextResponse } from "next/server";
import { validateBearerToken, createUnauthorizedResponse } from "@/lib/bot-auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { revalidateAllCaches } from "@/lib/cache-invalidation";

export async function POST(request: NextRequest) {
  // Validate bearer token
  if (!validateBearerToken(request)) {
    return createUnauthorizedResponse();
  }

  // Rate limiting: 10 requests per minute (more restrictive since this is expensive)
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
    // Revalidate all caches
    revalidateAllCaches();

    return NextResponse.json(
      {
        message: "All caches revalidated successfully",
        timestamp: new Date().toISOString(),
      },
      { headers: rateLimitHeaders }
    );
  } catch (error) {
    console.error("Error revalidating caches:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: rateLimitHeaders }
    );
  }
}
