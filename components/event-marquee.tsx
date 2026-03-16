"use client";

import { Event } from "@/types/event";
import Marquee from "@/components/ui/marquee";
import EventCard from "./event-card";

interface EventMarqueeSectionProps {
  events: Event[];
}

export function EventMarqueeSection({ events }: EventMarqueeSectionProps) {
  if (!events.length) {
    return (
      <section className="space-y-2">
        <h2 className="text-2xl font-semibold text-center">Upcoming Events</h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          No upcoming events found.
        </p>
      </section>
    );
  }

  // Duplicate events to fill the marquee without empty space
  // The Marquee component duplicates children internally, so we need enough items
  // to create a seamless loop. Aim for at least 8-10 items total.
  const minItems = 10;
  const duplicationsNeeded = Math.max(1, Math.ceil(minItems / events.length));
  const duplicatedEvents = Array(duplicationsNeeded)
    .fill(null)
    .flatMap(() => events);

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-center">Upcoming Events</h2>
      <div className="mx-auto w-full max-w-[1200px] px-0 sm:px-4">
        <Marquee
          pauseOnHover
          className="[--duration:80s] [--gap:1rem] cursor-pointer"
        >
          {duplicatedEvents.map((event, index) => (
            <div
              key={`${event.id}-${index}`}
              className="px-2 cursor-pointer [&>*]:data-[slot=card]:bg-card [&>*]:data-[slot=card]:shadow-xs"
            >
              <EventCard {...event} />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
