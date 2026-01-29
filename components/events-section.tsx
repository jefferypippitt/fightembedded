import { getLiveUpcomingEvents } from "@/server/actions/events";
import { EventMarqueeSection } from "@/components/event-marquee";

export default async function EventsSection() {
  try {
    const events = await getLiveUpcomingEvents();

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
