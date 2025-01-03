"use client";

import { Event } from "@prisma/client";
import Marquee from "@/components/ui/marquee";
import EventCard from "./event-card";
import { Badge } from "@/components/ui/badge";

interface EventMarqueeSectionProps {
  events: Event[];
}

export function EventMarqueeSection({ events }: EventMarqueeSectionProps) {
  if (!events.length) {
    return (
      <section className="space-y-2">
        <div className="flex justify-center">
          <Badge
            variant="outline"
            className="px-4 py-1.5 text-base bg-red-500/10 text-red-600 dark:text-red-400 border-red-600/20 dark:border-red-500/30"
          >
            Upcoming Events
          </Badge>
        </div>
        <p className="text-neutral-600 dark:text-neutral-400">
          No upcoming events found.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-2">
      <div className="flex justify-center">
        <Badge
          variant="outline"
          className="px-4 py-1.5 text-base bg-red-500/10 text-red-600 dark:text-red-400 border-red-600/20 dark:border-red-500/30"
        >
          Upcoming Events
        </Badge>
      </div>
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
