import { getUpcomingEvents } from "@/server/actions/events";
import { EventMarqueeSection } from "@/components/event-marquee";

interface EventsSectionProps {
  events?: Awaited<ReturnType<typeof getUpcomingEvents>>;
}

export default async function EventsSection({ events: providedEvents }: EventsSectionProps = {}) {
  try {
    const events = providedEvents ?? (await getUpcomingEvents());

    // Only render if there are upcoming events
    if (!events || events.length === 0) {
      return null;
    }

    return <EventMarqueeSection events={events} />;
  } catch (error) {
    console.error("Error in EventsSection:", error);
    // Return null on error to hide the section
    return null;
  }
}
