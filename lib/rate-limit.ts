import { headers } from "next/headers";

interface RateLimitOptions {
  /**
   * Maximum number of requests allowed
   */
  limit: number;
  /**
   * Time window in seconds
   */
  window: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting
// In production, consider using Redis or a database for distributed systems
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Simple rate limiter for server actions
 * Uses in-memory storage (consider Redis for production)
 */
export async function rateLimit(
  identifier: string,
  options: RateLimitOptions
): Promise<{ success: boolean; remaining: number; resetAt: number }> {
  const { limit, window } = options;
  const now = Date.now();
  const resetAt = now + window * 1000;

  const entry = rateLimitStore.get(identifier);

  // Clean up expired entries periodically (every 1000 checks)
  if (rateLimitStore.size > 1000) {
    for (const [key, value] of rateLimitStore.entries()) {
      if (value.resetTime < now) {
        rateLimitStore.delete(key);
      }
    }
  }

  if (!entry || entry.resetTime < now) {
    // New or expired entry
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: resetAt,
    });
    return {
      success: true,
      remaining: limit - 1,
      resetAt,
    };
  }

  // Increment count
  entry.count += 1;

  if (entry.count > limit) {
    return {
      success: false,
      remaining: 0,
      resetAt: entry.resetTime,
    };
  }

  return {
    success: true,
    remaining: limit - entry.count,
    resetAt: entry.resetTime,
  };
}

/**
 * Get rate limit identifier from request headers
 * Uses IP address or user session ID
 */
export async function getRateLimitIdentifier(): Promise<string> {
  const requestHeaders = await headers();
  
  // Try to get IP from headers (common proxy headers)
  const forwardedFor = requestHeaders.get("x-forwarded-for");
  const realIp = requestHeaders.get("x-real-ip");
  const ip = forwardedFor?.split(",")[0] || realIp || "unknown";

  // For authenticated requests, you could use session ID instead
  // const session = await auth.api.getSession({ headers: requestHeaders });
  // return session?.user?.id || ip;

  return `rate-limit:${ip}`;
}

/**
 * Get rate limit identifier from Request object (for Route Handlers)
 * Uses IP address from request headers
 */
export function getRateLimitIdentifierFromRequest(request: Request): string {
  // Try to get IP from headers (common proxy headers)
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwardedFor?.split(",")[0]?.trim() || realIp || "unknown";

  return `rate-limit:${ip}`;
}

/**
 * Check rate limit for Route Handlers
 * Returns rate limit status with appropriate headers
 */
export async function checkRateLimit(
  request: Request,
  options: RateLimitOptions = { limit: 10, window: 60 }
): Promise<{
  rateLimited: boolean;
  remaining: number;
  resetAt: number;
  headers: Headers;
}> {
  const identifier = getRateLimitIdentifierFromRequest(request);
  const result = await rateLimit(identifier, options);

  const headers = new Headers();
  headers.set("X-RateLimit-Limit", options.limit.toString());
  headers.set("X-RateLimit-Remaining", result.remaining.toString());
  headers.set("X-RateLimit-Reset", Math.ceil(result.resetAt / 1000).toString());

  return {
    rateLimited: !result.success,
    remaining: result.remaining,
    resetAt: result.resetAt,
    headers,
  };
}

/**
 * Rate limit decorator for server actions
 * Throws error if rate limit exceeded
 */
export async function withRateLimit<T>(
  action: () => Promise<T>,
  options: RateLimitOptions = { limit: 10, window: 60 }
): Promise<T> {
  const identifier = await getRateLimitIdentifier();
  const result = await rateLimit(identifier, options);

  if (!result.success) {
    throw new Error(
      `Rate limit exceeded. Please try again in ${Math.ceil(
        (result.resetAt - Date.now()) / 1000
      )} seconds.`
    );
  }

  return action();
}
