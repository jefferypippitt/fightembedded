import { getUpcomingEvents } from "@/server/actions/get-event";
import { EventMarqueeSection } from "@/components/event-marquee";
import { EventMarqueeSkeleton } from "@/components/event-marquee-skeleton";
import { Suspense } from "react";

export default async function EventsSectionWrapper() {
  const events = await getUpcomingEvents();

  return (
    <Suspense fallback={<EventMarqueeSkeleton />}>
      <EventMarqueeSection events={events} />
    </Suspense>
  );
}
