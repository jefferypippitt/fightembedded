import { NextRequest, NextResponse } from "next/server";
import { validateBearerToken, createUnauthorizedResponse } from "@/lib/bot-auth";
import { checkRateLimit } from "@/lib/rate-limit";
import prisma from "@/lib/prisma";
import { invalidateEventCache } from "@/lib/cache-invalidation";
import { z } from "zod";

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
    const body = await request.json();

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

    // Update event
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: finalData,
    });

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
