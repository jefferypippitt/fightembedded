"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { eventSchema } from "@/schemas/event";
import { z } from "zod";
import { ActionResponse, EventInput, Event } from "@/types/event";
import {
  revalidatePath,
  revalidateTag,
  unstable_noStore as noStore,
} from "next/cache";

// Authentication helper
async function checkAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

// Get single event by ID
export async function getEvent(id: string): Promise<Event | null> {
  try {
    const event = await prisma.event.findUnique({
      where: { id },
    });
    return event;
  } catch (error) {
    console.error("Error fetching event:", error);
    throw new Error("Failed to fetch event");
  }
}

// Get upcoming events (always fresh, with optional limit)
export async function getUpcomingEvents(take?: number): Promise<Event[]> {
  try {
    const events = await prisma.event.findMany({
      where: { status: "UPCOMING" },
      orderBy: { date: "asc" },
      ...(take && { take }),
    });
    return events;
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    return [];
  }
}

// Get live upcoming events (no cache, with optional limit)
export async function getLiveUpcomingEvents(take?: number): Promise<Event[]> {
  noStore();

  try {
    const events = await prisma.event.findMany({
      where: { status: "UPCOMING" },
      orderBy: { date: "asc" },
      ...(take && { take }),
    });
    return events;
  } catch (error) {
    console.error("Error fetching live upcoming events:", error);
    return [];
  }
}

// Create new event
export async function createEvent(formData: FormData): Promise<ActionResponse> {
  try {
    await checkAuth();
    const rawData = Object.fromEntries(formData.entries());

    const data: EventInput = {
      name: String(rawData.name),
      date: new Date(rawData.date as string),
      venue: String(rawData.venue),
      location: String(rawData.location),
      mainEvent: String(rawData.mainEvent),
      status: (rawData.status as "UPCOMING" | "COMPLETED") || "UPCOMING",
    };

    const validatedData = eventSchema.parse(data);
    const event = await prisma.event.create({ data: validatedData });

    // Revalidate cache
    revalidateEventCache();
    revalidatePath("/");

    return {
      status: "success",
      message: "Event created successfully",
      data: event,
    };
  } catch (error) {
    console.error("Create event error:", error);

    if (error instanceof z.ZodError) {
      return {
        status: "error",
        message: `Validation error: ${error.errors
          .map((e) => e.message)
          .join(", ")}`,
      };
    }

    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Failed to create event",
    };
  }
}

// Update existing event
export async function updateEvent(
  id: string,
  formData: FormData
): Promise<ActionResponse> {
  try {
    await checkAuth();
    const rawData = Object.fromEntries(formData.entries());

    const data: EventInput = {
      name: String(rawData.name),
      date: new Date(rawData.date as string),
      venue: String(rawData.venue),
      location: String(rawData.location),
      mainEvent: String(rawData.mainEvent),
      status: (rawData.status as "UPCOMING" | "COMPLETED") || "UPCOMING",
    };

    const validatedData = eventSchema.parse(data);
    const event = await prisma.event.update({
      where: { id },
      data: validatedData,
    });

    // Revalidate cache
    revalidateEventCache();
    revalidatePath("/");

    return {
      status: "success",
      message: "Event updated successfully",
      data: event,
    };
  } catch (error) {
    console.error("Update event error:", error);

    if (error instanceof z.ZodError) {
      return {
        status: "error",
        message: `Validation error: ${error.errors
          .map((e) => e.message)
          .join(", ")}`,
      };
    }

    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Failed to update event",
    };
  }
}

// Delete event
export async function deleteEvent(id: string): Promise<ActionResponse> {
  try {
    await checkAuth();

    await prisma.event.delete({
      where: { id },
    });

    // Revalidate cache
    revalidateEventCache();
    revalidatePath("/");

    return {
      status: "success",
      message: "Event deleted successfully",
    };
  } catch (error) {
    console.error("Delete event error:", error);
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Failed to delete event",
    };
  }
}

// Helper function to revalidate all event-related cache
function revalidateEventCache() {
  revalidateTag("events");
  revalidateTag("upcoming-events");
  revalidateTag("events-page");
  revalidateTag("homepage");
  revalidateTag("homepage-stats");
  revalidatePath("/events");
}
