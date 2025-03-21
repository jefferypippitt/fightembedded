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
        <div className="flex justify-center">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            Upcoming Events
          </h2>
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
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          Upcoming Events
        </h2>
      </div>
      <div className="w-[900px] mx-auto">
        <Marquee pauseOnHover className="[--duration:40s]">
            {events.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </Marquee>
      </div>
    </section>
  );
}
