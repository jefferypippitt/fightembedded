"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { eventSchema } from "@/schemas/event";
import { revalidatePath, revalidateTag } from "next/cache";
import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";
import { getRateLimitIdentifier, rateLimit } from "@/lib/rate-limit";

// Authentication helper - wrapped with React.cache() for per-request deduplication
const checkAuth = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
});

export async function createEvent(formData: FormData) {
  try {
    await checkAuth();
    
    // Rate limiting: 5 creates per minute
    const identifier = await getRateLimitIdentifier();
    const rateLimitResult = await rateLimit(`${identifier}:create-event`, {
      limit: 5,
      window: 60,
    });
    
    if (!rateLimitResult.success) {
      return {
        status: "error",
        message: `Rate limit exceeded. Please try again in ${Math.ceil(
          (rateLimitResult.resetAt - Date.now()) / 1000
        )} seconds.`,
      };
    }
    const rawData = Object.fromEntries(formData.entries());

    const data = {
      name: String(rawData.name),
      date: new Date(String(rawData.date)),
      venue: String(rawData.venue),
      location: String(rawData.location),
      mainEvent: String(rawData.mainEvent),
      coMainEvent: rawData.coMainEvent
        ? String(rawData.coMainEvent)
        : undefined,
      status: String(rawData.status) as "UPCOMING" | "COMPLETED" | "CANCELLED",
    };

    const validatedData = eventSchema.parse(data);
    const event = await prisma.event.create({ data: validatedData });

    // Revalidate cache tags
    revalidateTag("all-events", "max");
    revalidateTag("upcoming-events", "max");
    revalidateTag("live-upcoming-events", "max");
    revalidateTag("stats", "max");
    revalidateTag("live-stats", "max");
    revalidateTag("dashboard-stats", "max");
    revalidateTag(`event-${event.id}`, "max");

    // Revalidate public events pages if the new event is upcoming
    if (validatedData.status === "UPCOMING") {
      revalidatePath("/events", "page");
      revalidatePath("/", "page");
    }

    return { status: "success", message: "Event created successfully", event };
  } catch (error) {
    console.error("Failed to create event:", error);
    return { status: "error", message: "Failed to create event" };
  }
}

export async function updateEvent(id: string, formData: FormData) {
  try {
    await checkAuth();
    
    // Rate limiting: 10 updates per minute
    const identifier = await getRateLimitIdentifier();
    const rateLimitResult = await rateLimit(`${identifier}:update-event`, {
      limit: 10,
      window: 60,
    });
    
    if (!rateLimitResult.success) {
      return {
        status: "error",
        message: `Rate limit exceeded. Please try again in ${Math.ceil(
          (rateLimitResult.resetAt - Date.now()) / 1000
        )} seconds.`,
      };
    }
    const rawData = Object.fromEntries(formData.entries());

    const data = {
      name: String(rawData.name),
      date: new Date(String(rawData.date)),
      venue: String(rawData.venue),
      location: String(rawData.location),
      mainEvent: String(rawData.mainEvent),
      coMainEvent: rawData.coMainEvent
        ? String(rawData.coMainEvent)
        : undefined,
      status: String(rawData.status) as "UPCOMING" | "COMPLETED" | "CANCELLED",
    };

    const validatedData = eventSchema.parse(data);
    const event = await prisma.event.update({
      where: { id },
      data: validatedData,
    });

    // Revalidate cache tags
    revalidateTag("all-events", "max");
    revalidateTag("upcoming-events", "max");
    revalidateTag("live-upcoming-events", "max");
    revalidateTag("stats", "max");
    revalidateTag("live-stats", "max");
    revalidateTag("dashboard-stats", "max");
    revalidateTag(`event-${id}`, "max");
    revalidateTag(`event-edit-${id}`, "max"); // Invalidate edit cache

    // Revalidate public pages
    revalidatePath("/events", "page");
    revalidatePath("/", "page");

    return { status: "success", message: "Event updated successfully", event };
  } catch (error) {
    console.error(`Failed to update event ${id}:`, error);
    return { status: "error", message: "Failed to update event" };
  }
}

export async function deleteEvent(id: string) {
  try {
    await checkAuth();
    
    // Rate limiting: 3 deletes per minute
    const identifier = await getRateLimitIdentifier();
    const rateLimitResult = await rateLimit(`${identifier}:delete-event`, {
      limit: 3,
      window: 60,
    });
    
    if (!rateLimitResult.success) {
      return {
        status: "error",
        message: `Rate limit exceeded. Please try again in ${Math.ceil(
          (rateLimitResult.resetAt - Date.now()) / 1000
        )} seconds.`,
      };
    }

    await prisma.event.delete({ where: { id } });

    // Revalidate cache tags
    revalidateTag("all-events", "max");
    revalidateTag("upcoming-events", "max");
    revalidateTag("live-upcoming-events", "max");
    revalidateTag("stats", "max");
    revalidateTag("live-stats", "max");
    revalidateTag("dashboard-stats", "max");
    revalidateTag(`event-${id}`, "max");

    // Revalidate public pages
    revalidatePath("/events", "page");
    revalidatePath("/", "page");

    return { status: "success", message: "Event deleted successfully" };
  } catch (error) {
    console.error(`Failed to delete event ${id}:`, error);
    return { status: "error", message: "Failed to delete event" };
  }
}

export async function getEvent(id: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("event-by-id");
  cacheTag(`event-${id}`);

  try {
    const event = await prisma.event.findUnique({ where: { id } });
    return event;
  } catch (error) {
    console.error(`Failed to fetch event ${id}:`, error);
    return null;
  }
}

// Get single event by ID (for edit pages - always fresh data, no caching)
export async function getEventForEdit(id: string) {
  try {
    // Check authentication for edit pages
    await checkAuth();
    
    const event = await prisma.event.findUnique({ where: { id } });
    return event;
  } catch (error) {
    console.error(`Failed to fetch event ${id}:`, error);
    return null;
  }
}

export async function getLiveUpcomingEvents() {
  "use cache";
  cacheLife("days"); // UFC events are weekly, cache longer since schedule is stable
  cacheTag("live-upcoming-events");

  try {
    const events = await prisma.event.findMany({
      where: {
        status: "UPCOMING",
        // Removed date filter to show all UPCOMING events regardless of date
        // Events will only be hidden when status is changed to COMPLETED or CANCELLED
      },
      orderBy: {
        date: "asc", // Show earliest upcoming events first
      },
      select: {
        id: true,
        name: true,
        date: true,
        venue: true,
        location: true,
        mainEvent: true,
        coMainEvent: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return events;
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    return [];
  }
}

export async function getUpcomingEvents() {
  "use cache";
  cacheLife("days"); // UFC events are weekly, cache longer since schedule is stable
  cacheTag("upcoming-events");

  try {
    const events = await prisma.event.findMany({
      where: {
        status: "UPCOMING",
        // Removed date filter to show all UPCOMING events regardless of date
        // Events will only be hidden when status is changed to COMPLETED or CANCELLED
      },
      orderBy: {
        date: "asc", // Show earliest upcoming events first
      },
      select: {
        id: true,
        name: true,
        date: true,
        venue: true,
        location: true,
        mainEvent: true,
        coMainEvent: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return events;
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    return [];
  }
}

// Get all events
export async function getAllEvents() {
  "use cache";
  cacheLife("hours");
  cacheTag("all-events");

  try {
    const events = await prisma.event.findMany({
      orderBy: { date: "desc" },
    });
    return events;
  } catch (error) {
    console.error("Error fetching all events:", error);
    return [];
  }
}
