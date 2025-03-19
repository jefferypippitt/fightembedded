"use client";

import { Event } from "@prisma/client";
import Marquee from "@/components/ui/marquee";
import EventCard from "./event-card";
import { cn } from "@/lib/utils";

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
      <div
        className={cn(
          "relative flex h-[180px] w-full flex-col items-center justify-center overflow-hidden rounded-lg",
          "border border-red-600/20 dark:border-red-600/20",
          "bg-gray-50 dark:bg-zinc-950",
          "bg-gradient-to-r from-transparent via-red-600/[0.03] to-transparent",
          "dark:bg-gradient-to-r dark:from-transparent dark:via-red-400/[0.02] dark:to-transparent",
          "px-4"
        )}
      >
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
