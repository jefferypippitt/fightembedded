import { Button } from "@/components/ui/button";

import Link from "next/link";
import { EventsTable } from "@/components/events-table";
import prisma from "@/lib/prisma";
import { UFCEvent } from "@/types/event";
import {PlusCircle } from "lucide-react";

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
    <div className="py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Manage Events</h1>
        <Button variant="default" size="sm" asChild>
            <Link href="/dashboard/events/new">
              <PlusCircle className="h-4 w-4 mr-1" />
              Add Event
            </Link>
          </Button>
      </div>
      <EventsTable events={typedEvents} />
    </div>
  );
} 