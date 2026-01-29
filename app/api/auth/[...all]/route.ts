import { auth } from "@/lib/auth"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

const authHandler = toNextJsHandler(auth);

// Rate limit options for sign-in attempts
// Allow 5 sign-in attempts per 15 minutes per IP
const SIGN_IN_RATE_LIMIT = { limit: 5, window: 900 }; // 15 minutes

export async function POST(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;

  // Apply rate limiting specifically for sign-in attempts
  if (pathname.includes("/sign-in") || pathname.endsWith("/sign-in")) {
    const { rateLimited, headers: rateLimitHeaders } = await checkRateLimit(
      request,
      SIGN_IN_RATE_LIMIT
    );

    if (rateLimited) {
      return NextResponse.json(
        {
          error: {
            message: "Too many sign-in attempts. Please try again later.",
            code: "RATE_LIMIT_EXCEEDED",
          },
        },
        {
          status: 429,
          headers: rateLimitHeaders,
        }
      );
    }

    // Call the auth handler and merge rate limit headers into the response
    const response = await authHandler.POST(request);
    const responseHeaders = new Headers(response.headers);
    
    // Merge rate limit headers
    rateLimitHeaders.forEach((value, key) => {
      responseHeaders.set(key, value);
    });

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  }

  // For other auth endpoints, proceed without rate limiting
  return authHandler.POST(request);
}

export async function GET(request: NextRequest) {
  return authHandler.GET(request);
}
