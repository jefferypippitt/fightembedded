import { Event } from "@prisma/client";
import EventCard from "./event-card";

interface EventsSectionProps {
  events: Event[];
}

export const EventsSection = ({ events }: EventsSectionProps) => {
  if (!events.length) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Upcoming Events</h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          No upcoming events found.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Upcoming Events</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {events.map((event) => (
          <div key={event.id} className="w-full">
            <EventCard {...event} />
          </div>
        ))}
      </div>
    </section>
  );
};
