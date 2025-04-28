"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from 'next/cache';

export type Event = {
  id: string;
  name: string;
  date: Date;
  location: string;
  imageUrl: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export async function getAllUpcomingEvents() {
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