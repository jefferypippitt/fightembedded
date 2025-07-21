import { getLiveUpcomingEvents } from "@/server/actions/get-event";
import { EventMarqueeSection } from "@/components/event-marquee";

export default async function EventsSectionWrapper() {
  const events = await getLiveUpcomingEvents();

  return <EventMarqueeSection events={events} />;
}
