"use server";

import prisma from "@/lib/prisma";
import { unstable_cache, unstable_noStore as noStore } from "next/cache";

export async function getEvent(id: string) {
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

// Homepage events (limited to 4)
export const getUpcomingEvents = unstable_cache(
  async () => {
    try {
      const events = await prisma.event.findMany({
        where: {
          status: "UPCOMING",
        },
        orderBy: {
          date: "asc",
        },
        take: 4, // Only 4 events for homepage
      });

      return events;
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
      return [];
    }
  },
  ["upcoming-events-preview"],
  {
    tags: ["events", "homepage"], // Tag for cache invalidation
  }
);

// All upcoming events for main events page
export const getAllUpcomingEvents = unstable_cache(
  async () => {
    try {
      const events = await prisma.event.findMany({
        where: {
          status: "UPCOMING",
        },
        orderBy: {
          date: "asc",
        },
        // No take limit - get all upcoming events
      });

      return events;
    } catch (error) {
      console.error("Error fetching all upcoming events:", error);
      return [];
    }
  },
  ["all-upcoming-events"],
  {
    tags: ["events", "events-page"], // Tag for cache invalidation
  }
);

// Live upcoming events function for homepage (4 events)
export const getLiveUpcomingEvents = async () => {
  // Disable caching to ensure fresh data
  noStore();

  try {
    const events = await prisma.event.findMany({
      where: {
        status: "UPCOMING",
      },
      orderBy: {
        date: "asc",
      },
      take: 4, // Only 4 events for homepage
    });

    return events;
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    return [];
  }
};
