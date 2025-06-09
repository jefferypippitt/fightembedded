"use server";

import prisma from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";
import { revalidatePath } from 'next/cache';

export type Event = {
  id: string;
  name: string;
  date: Date;
  location: string;
  venue: string;
  imageUrl: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export async function getAllUpcomingEvents() {
  // Disable caching to ensure fresh data
  noStore();

  try {
    const currentDate = new Date();
    
    const events = await prisma.event.findMany({
      where: {
        AND: [
          { status: "UPCOMING" },
          {
            date: {
              gte: currentDate,
            },
          },
        ],
      },
      orderBy: {
        date: "asc",
      },
      select: {
        id: true,
        name: true,
        date: true,
        location: true,
        venue: true,
        mainEvent: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return events;
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    return [];
  }
}

export async function revalidateEvents() {
  revalidatePath('/events');
} 