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

const DUPLICATE_WINDOW_MS = 24 * 60 * 60 * 1000;

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

    // Reject retries and duplicates: same name within a day of the same date
    const existingEvent = await prisma.event.findFirst({
      where: {
        name: { equals: eventData.name, mode: "insensitive" },
        date: {
          gte: new Date(eventData.date.getTime() - DUPLICATE_WINDOW_MS),
          lte: new Date(eventData.date.getTime() + DUPLICATE_WINDOW_MS),
        },
      },
      select: { id: true, name: true, date: true },
    });

    if (existingEvent) {
      return NextResponse.json(
        {
          error: "An event with this name already exists on this date",
          id: existingEvent.id,
          name: existingEvent.name,
          date: existingEvent.date,
        },
        { status: 409, headers: rateLimitHeaders }
      );
    }

    // Create event
    const event = await prisma.event.create({
      data: eventData,
    });

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

    // Build where clause
    const where: {
      name?: { contains: string; mode: "insensitive" };
      status?: "UPCOMING" | "COMPLETED" | "CANCELLED";
    } = {};

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
      take: 50, // Limit to 50 results
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
