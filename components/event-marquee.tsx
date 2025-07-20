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
    <section className="space-y-4">
      <div className="flex justify-center">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          Upcoming Events
        </h2>
      </div>
      <div className="w-full max-w-[1200px] mx-auto px-4">
        <Marquee
          pauseOnHover
          className="[--duration:40s] [--gap:1rem] cursor-pointer"
        >
          {events.map((event) => (
            <div
              key={event.id}
              className="px-2 cursor-pointer [&>*]:data-[slot=card]:from-primary/5 [&>*]:data-[slot=card]:to-card dark:[&>*]:data-[slot=card]:bg-card [&>*]:data-[slot=card]:bg-gradient-to-t [&>*]:data-[slot=card]:shadow-xs"
            >
              <EventCard {...event} />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
