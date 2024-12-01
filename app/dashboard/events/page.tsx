
import prisma from "@/lib/prisma";
import { UFCEvent } from "@/types/event";
import { EventsTable } from "./events-table";

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: {
      date: "desc",
    },
  });

  const typedEvents: UFCEvent[] = events.map(event => ({
    ...event,
    status: event.status as "UPCOMING" | "COMPLETED" | "CANCELLED"
  }));

  return <EventsTable events={typedEvents} />;
} 