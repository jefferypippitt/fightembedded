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

  return token === expectedToken;
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
