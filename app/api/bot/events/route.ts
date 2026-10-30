import { NextRequest, NextResponse } from "next/server";
import {
  validateBearerToken,
  createUnauthorizedResponse,
  readJsonBody,
  createInvalidJsonResponse,
} from "@/lib/bot-auth";
import { checkRateLimit } from "@/lib/rate-limit";
import prisma from "@/lib/prisma";
import { invalidateEventCache } from "@/lib/cache-invalidation";
import { eventSchema } from "@/schemas/event";
import { z } from "zod";
import { findDuplicateEvent, lockEventName } from "@/lib/bot-duplicates";

const DEFAULT_LIST_LIMIT = 50;
const MAX_LIST_LIMIT = 200;

// undefined when absent, null when present but not a date
function parseDateParam(value: string | null): Date | undefined | null {
  if (value === null || value === "") return undefined;
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
}

// Create event schema for bot API (accepts ISO date string instead of Date object)
const botEventCreateSchema = eventSchema.extend({
  date: z.string().datetime().or(z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format. Use ISO 8601 format.",
  })),
  status: eventSchema.shape.status.default("UPCOMING"),
}).transform((data) => ({
  ...data,
  date: new Date(data.date),
  imageUrl: data.imageUrl && data.imageUrl.trim() !== "" ? data.imageUrl : undefined,
}));

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

    // Validate request body
    const validationResult = botEventCreateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: validationResult.error.errors,
        },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    const eventData = validationResult.data;

    // Reject retries and duplicates: same name within a day of the same
    // date. Locked so two concurrent creates cannot both succeed.
    const result = await prisma.$transaction(async (tx) => {
      await lockEventName(tx, eventData.name);

      const existing = await findDuplicateEvent(
        tx,
        eventData.name,
        eventData.date
      );
      if (existing) {
        return { existing };
      }

      const created = await tx.event.create({
        data: eventData,
      });
      return { created };
    });

    if (result.existing) {
      return NextResponse.json(
        {
          error: "An event with this name already exists on this date",
          id: result.existing.id,
          name: result.existing.name,
          date: result.existing.date,
        },
        { status: 409, headers: rateLimitHeaders }
      );
    }

    const event = result.created;

    // Invalidate relevant caches
    invalidateEventCache({
      eventId: event.id,
      isUpcoming: eventData.status === "UPCOMING",
    });

    return NextResponse.json(
      {
        message: "Event created successfully",
        event,
      },
      { status: 201, headers: rateLimitHeaders }
    );
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: rateLimitHeaders }
    );
  }
}

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
    const status = searchParams.get("status");
    const from = parseDateParam(searchParams.get("from"));
    const to = parseDateParam(searchParams.get("to"));
    const limitParam = searchParams.get("limit");
    const limit = limitParam === null ? DEFAULT_LIST_LIMIT : Number(limitParam);

    if (from === null || to === null) {
      return NextResponse.json(
        { error: "'from' and 'to' must be dates in ISO 8601 format" },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIST_LIMIT) {
      return NextResponse.json(
        { error: `'limit' must be an integer from 1 to ${MAX_LIST_LIMIT}` },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    // Build where clause
    const where: {
      name?: { contains: string; mode: "insensitive" };
      status?: "UPCOMING" | "COMPLETED" | "CANCELLED";
      date?: { gte?: Date; lte?: Date };
    } = {};

    if (from || to) {
      where.date = {
        ...(from && { gte: from }),
        ...(to && { lte: to }),
      };
    }

    if (name) {
      where.name = {
        contains: name,
        mode: "insensitive",
      };
    }

    if (status) {
      const validStatus = ["UPCOMING", "COMPLETED", "CANCELLED"];
      if (validStatus.includes(status.toUpperCase())) {
        where.status = status.toUpperCase() as "UPCOMING" | "COMPLETED" | "CANCELLED";
      }
    }

    // Fetch events (uncached for bot use)
    const events = await prisma.event.findMany({
      where,
      orderBy: { date: "desc" },
      take: limit,
    });

    return NextResponse.json(
      {
        count: events.length,
        events,
      },
      { headers: rateLimitHeaders }
    );
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: rateLimitHeaders }
    );
  }
}
