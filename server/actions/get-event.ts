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
          AND: [
            { status: "UPCOMING" },
            {
              date: {
                gte: new Date(),
              },
            },
          ],
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
  ['upcoming-events-preview'],
  { 
    revalidate: 3600, // Revalidate every hour
    tags: ['events'] // Tag for cache invalidation
  }
);
