import { getUpcomingEvents } from "@/server/actions/events";
import { EventMarqueeSection } from "@/components/event-marquee";

interface EventsSectionProps {
  events?: Awaited<ReturnType<typeof getUpcomingEvents>>;
}

export default async function EventsSection({ events: providedEvents }: EventsSectionProps = {}) {
  let events;
  try {
    events = providedEvents ?? (await getUpcomingEvents());
  } catch (error) {
    console.error("Error in EventsSection:", error);
    return null;
  }

  if (!events || events.length === 0) {
    return null;
  }

  return <EventMarqueeSection events={events} />;
}
