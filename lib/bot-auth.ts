import { createHash, timingSafeEqual } from "node:crypto";
import { NextRequest } from "next/server";

/**
 * Validates the bearer token from the Authorization header
 * @param request - The incoming request
 * @returns true if the token is valid, false otherwise
 */
export function validateBearerToken(request: NextRequest): boolean {
  const authHeader = request.headers.get("Authorization");
  
  if (!authHeader) {
    return false;
  }

  const [type, token] = authHeader.split(" ");
  
  if (type !== "Bearer" || !token) {
    return false;
  }

  const expectedToken = process.env.BOT_API_SECRET;
  
  if (!expectedToken) {
    console.error("BOT_API_SECRET environment variable is not set");
    return false;
  }

  // Hash both sides so the comparison is constant-time and length-independent
  const tokenHash = createHash("sha256").update(token).digest();
  const expectedHash = createHash("sha256").update(expectedToken).digest();

  return timingSafeEqual(tokenHash, expectedHash);
}

/**
 * Reads a JSON request body without throwing on malformed input
 */
export async function readJsonBody(
  request: Request
): Promise<{ ok: true; body: unknown } | { ok: false }> {
  try {
    return { ok: true, body: await request.json() };
  } catch {
    return { ok: false };
  }
}

/**
 * Creates a 400 response for a body that is not valid JSON
 */
export function createInvalidJsonResponse(headers?: Headers) {
  return Response.json(
    { error: "Request body must be valid JSON." },
    { status: 400, headers }
  );
}

/**
 * Creates an unauthorized response
 */
export function createUnauthorizedResponse() {
  return Response.json(
    { error: "Unauthorized. Valid Bearer token required." },
    { status: 401 }
  );
}
