"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { eventSchema } from "@/schemas/event";
import { revalidatePath, revalidateTag } from "next/cache";
import { cacheLife, cacheTag } from "next/cache";

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

export async function createEvent(formData: FormData) {
  try {
    await checkAuth();
    const rawData = Object.fromEntries(formData.entries());

    const data = {
      name: String(rawData.name),
      date: new Date(String(rawData.date)),
      venue: String(rawData.venue),
      location: String(rawData.location),
      mainEvent: String(rawData.mainEvent),
      status: String(rawData.status) as "UPCOMING" | "COMPLETED" | "CANCELLED",
    };

    const validatedData = eventSchema.parse(data);
    const event = await prisma.event.create({ data: validatedData });

    // Revalidate cache tags
    revalidateTag("all-events", "max");
    revalidateTag("upcoming-events", "max");
    revalidateTag("live-upcoming-events", "max");
    revalidateTag("paginated-events", "max");
    revalidateTag(`event-${event.id}`, "max");

    // Revalidate dashboard events
    revalidatePath("/dashboard/events", "page");

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
    const rawData = Object.fromEntries(formData.entries());

    const data = {
      name: String(rawData.name),
      date: new Date(String(rawData.date)),
      venue: String(rawData.venue),
      location: String(rawData.location),
      mainEvent: String(rawData.mainEvent),
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
    revalidateTag("paginated-events", "max");
    revalidateTag(`event-${id}`, "max");

    // Revalidate dashboard events
    revalidatePath("/dashboard/events", "page");
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

    await prisma.event.delete({ where: { id } });

    // Revalidate cache tags
    revalidateTag("all-events", "max");
    revalidateTag("upcoming-events", "max");
    revalidateTag("live-upcoming-events", "max");
    revalidateTag("paginated-events", "max");
    revalidateTag(`event-${id}`, "max");

    // Revalidate dashboard events
    revalidatePath("/dashboard/events", "page");
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

export async function getLiveUpcomingEvents() {
  "use cache";
  cacheLife("hours");
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
      take: 5, // Limit to 5 events like you mentioned
      select: {
        id: true,
        name: true,
        date: true,
        venue: true,
        location: true,
        mainEvent: true,
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
  cacheLife("hours");
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
