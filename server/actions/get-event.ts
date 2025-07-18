"use server";

import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

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
        take: 4,
      });

      return events;
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
      return [];
    }
  },
  ["upcoming-events-preview"],
  {
    revalidate: 604800, // Cache for 1 week to match homepage
    tags: ["events", "homepage"], // Tag for cache invalidation
  }
);
