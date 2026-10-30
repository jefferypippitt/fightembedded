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
import { z } from "zod";
import { findDuplicateEvent, lockEventName } from "@/lib/bot-duplicates";

const eventUpdateSchema = z.object({
  name: z.string().min(2, "Event name is required").optional(),
  date: z.string().datetime().or(z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format. Use ISO 8601 format.",
  })).optional(),
  venue: z.string().min(2, "Venue is required").optional(),
  location: z.string().min(2, "Location is required").optional(),
  mainEvent: z.string().min(2, "Main event is required").optional(),
  coMainEvent: z.string().optional(),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  status: z.enum(["UPCOMING", "COMPLETED", "CANCELLED"]).optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided" }
);

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Validate bearer token
  if (!validateBearerToken(request)) {
    return createUnauthorizedResponse();
  }

  // Rate limiting: 30 requests per minute
  const { rateLimited, headers: rateLimitHeaders } = await checkRateLimit(
    request,
    { limit: 30, window: 60 }
  );

  if (rateLimited) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please try again later." },
      { status: 429, headers: rateLimitHeaders }
    );
  }

  try {
    const { id } = await params;
    const parsedBody = await readJsonBody(request);
    if (!parsedBody.ok) {
      return createInvalidJsonResponse(rateLimitHeaders);
    }
    const body = parsedBody.body;

    // Validate request body
    const validationResult = eventUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: validationResult.error.errors,
        },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    const updateData = validationResult.data;

    // Convert date string to Date if provided
    const finalData: Record<string, unknown> = { ...updateData };
    if (updateData.date) {
      finalData.date = new Date(updateData.date);
    }
    if (updateData.imageUrl !== undefined) {
      finalData.imageUrl = updateData.imageUrl.trim() !== "" ? updateData.imageUrl : null;
    }

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404, headers: rateLimitHeaders }
      );
    }

    // A name or date change must not collide with another event. The check
    // and write run under a lock on the resulting name.
    const finalName = updateData.name ?? existingEvent.name;
    const finalDate = updateData.date
      ? new Date(updateData.date)
      : existingEvent.date;
    const identityChanged =
      finalName.toLowerCase() !== existingEvent.name.toLowerCase() ||
      finalDate.getTime() !== existingEvent.date.getTime();

    const result = identityChanged
      ? await prisma.$transaction(async (tx) => {
          await lockEventName(tx, finalName);

          const duplicate = await findDuplicateEvent(
            tx,
            finalName,
            finalDate,
            id
          );
          if (duplicate) {
            return { duplicate };
          }

          const updated = await tx.event.update({
            where: { id },
            data: finalData,
          });
          return { updated };
        })
      : {
          updated: await prisma.event.update({
            where: { id },
            data: finalData,
          }),
        };

    if (result.duplicate) {
      return NextResponse.json(
        {
          error: "Another event with this name already exists on this date",
          id: result.duplicate.id,
          name: result.duplicate.name,
          date: result.duplicate.date,
        },
        { status: 409, headers: rateLimitHeaders }
      );
    }

    const updatedEvent = result.updated;

    // Determine if event is upcoming (either from update or existing status)
    const isUpcoming = 
      (updateData.status ?? existingEvent.status) === "UPCOMING";

    // Invalidate relevant caches
    invalidateEventCache({
      eventId: id,
      isUpcoming,
    });

    return NextResponse.json(
      {
        message: "Event updated successfully",
        event: updatedEvent,
      },
      { headers: rateLimitHeaders }
    );
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: rateLimitHeaders }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
    const { id } = await params;

    // Uncached so the bot always sees the current record
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404, headers: rateLimitHeaders }
      );
    }

    return NextResponse.json({ event }, { headers: rateLimitHeaders });
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: rateLimitHeaders }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Validate bearer token
  if (!validateBearerToken(request)) {
    return createUnauthorizedResponse();
  }

  // Rate limiting: 10 requests per minute
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
    const { id } = await params;

    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404, headers: rateLimitHeaders }
      );
    }

    await prisma.event.delete({
      where: { id },
    });

    // Same invalidation as the dashboard deleteEvent action
    invalidateEventCache({
      eventId: id,
      isUpcoming: event.status === "UPCOMING",
    });

    return NextResponse.json(
      {
        message: "Event deleted successfully",
        event: {
          id: event.id,
          name: event.name,
          date: event.date,
          status: event.status,
        },
      },
      { headers: rateLimitHeaders }
    );
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: rateLimitHeaders }
    );
  }
}
