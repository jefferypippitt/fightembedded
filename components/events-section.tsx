import { getUpcomingEvents } from "@/server/actions/get-event";
import { EventMarqueeSection } from "@/components/event-marquee";
import { EventMarqueeSkeleton } from "@/components/event-marquee-skeleton";
import { Suspense } from "react";
import { unstable_noStore as noStore } from "next/cache";

export default async function EventsSectionWrapper() {
  // Disable caching for this component
  noStore();
  
  const events = await getUpcomingEvents();

  return (
    <Suspense fallback={<EventMarqueeSkeleton />}>
      <EventMarqueeSection events={events} />
    </Suspense>
  );
}
 