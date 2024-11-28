"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { eventSchema } from "@/schemas/event";
import { z } from "zod";
import { ActionResponse, EventInput } from "@/types/event";

async function checkAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
}

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
      coMainEvent: rawData.coMainEvent ? String(rawData.coMainEvent) : undefined,
      status: (rawData.status as "UPCOMING" | "COMPLETED" | "CANCELLED") || "UPCOMING",
    };

    const validatedData = eventSchema.parse(data);

    const event = await prisma.event.create({
      data: validatedData,
    });

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
        message: `Validation error: ${error.errors.map((e) => e.message).join(", ")}`,
      };
    }

    return {
      status: "error",
      message: error instanceof Error ? error.message : "Failed to create event",
    };
  }
}
