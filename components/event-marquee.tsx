"use client";

import { Event } from "@prisma/client";
import Marquee from "@/components/ui/marquee";
import EventCard from "./event-card";

interface EventMarqueeSectionProps {
  events: Event[];
}

export function EventMarqueeSection({ events }: EventMarqueeSectionProps) {
  if (!events.length) {
    return (
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Upcoming Events</h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          No upcoming events found.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold">Upcoming Events</h2>
      <div className="relative flex h-[180px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background px-4">
        <div className="w-[900px] mx-auto">
          <Marquee pauseOnHover className="[--duration:40s]">
            {events.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
