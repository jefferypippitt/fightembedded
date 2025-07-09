"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";

async function checkAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
}

export async function deleteEvent(id: string) {
  await checkAuth();

  try {
    await prisma.event.delete({
      where: {
        id,
      },
    });

    // Revalidate cache tags
    revalidateTag("events");
    revalidateTag("upcoming-events");
    revalidateTag("upcoming-events-preview");
    revalidateTag("homepage");
    revalidateTag("homepage-stats");

    // Revalidate paths
    revalidatePath("/events");
    revalidatePath("/dashboard/events");
    revalidatePath("/");

    return {
      status: "success",
      message: "Event deleted successfully",
    };
  } catch (error) {
    console.error("Delete event error:", error);
    return {
      status: "error",
      message: "Failed to delete event",
    };
  }
}
