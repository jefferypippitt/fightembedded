import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EventsTable } from "@/components/events-table";
import prisma from "@/lib/prisma";
import { UFCEvent } from "@/types/event";

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

  return (
    <div className="container max-w-7xl mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Events</h1>
        <Button asChild>
          <Link href="/dashboard/events/new">Create Event</Link>
        </Button>
      </div>
      <EventsTable events={typedEvents} />
    </div>
  );
} 