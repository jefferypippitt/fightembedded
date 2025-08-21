"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { eventSchema } from "@/schemas/event";

export async function createEvent(formData: FormData) {
  try {
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

    // Revalidate dashboard events
    revalidatePath("/dashboard/events");

    // Revalidate public events pages if the new event is upcoming
    if (validatedData.status === "UPCOMING") {
      revalidatePath("/events");
      revalidatePath("/");
    }

    return { status: "success", message: "Event created successfully", event };
  } catch (error) {
    console.error("Failed to create event:", error);
    return { status: "error", message: "Failed to create event" };
  }
}

export async function updateEvent(id: string, formData: FormData) {
  try {
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

    // Revalidate dashboard events
    revalidatePath("/dashboard/events");

    // Revalidate public events pages if the updated event is upcoming
    if (validatedData.status === "UPCOMING") {
      revalidatePath("/events");
      revalidatePath("/");
    }

    return { status: "success", message: "Event updated successfully", event };
  } catch (error) {
    console.error(`Failed to update event ${id}:`, error);
    return { status: "error", message: "Failed to update event" };
  }
}

export async function deleteEvent(id: string) {
  try {
    // Get event details before deletion for cache invalidation
    const eventToDelete = await prisma.event.findUnique({
      where: { id },
      select: { status: true },
    });

    await prisma.event.delete({ where: { id } });

    // Revalidate dashboard events
    revalidatePath("/dashboard/events");

    // Revalidate public events pages if the deleted event was upcoming
    if (eventToDelete?.status === "UPCOMING") {
      revalidatePath("/events");
      revalidatePath("/");
    }

    return { status: "success", message: "Event deleted successfully" };
  } catch (error) {
    console.error(`Failed to delete event ${id}:`, error);
    return { status: "error", message: "Failed to delete event" };
  }
}

export async function getEvent(id: string) {
  try {
    const event = await prisma.event.findUnique({ where: { id } });
    return event;
  } catch (error) {
    console.error(`Failed to fetch event ${id}:`, error);
    return null;
  }
}

export async function getLiveUpcomingEvents() {
  try {
    const events = await prisma.event.findMany({
      where: {
        status: "UPCOMING",
        date: {
          gte: new Date(), // Only future events
        },
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
  try {
    const events = await prisma.event.findMany({
      where: {
        status: "UPCOMING",
        date: {
          gte: new Date(), // Only future events
        },
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
