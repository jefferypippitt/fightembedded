import { getUpcomingEvents } from "@/server/actions/get-event";
import { EventMarqueeSection } from "@/components/event-marquee";

export default async function EventsSectionWrapper() {
  const events = await getUpcomingEvents();

  return <EventMarqueeSection events={events} />;
}
