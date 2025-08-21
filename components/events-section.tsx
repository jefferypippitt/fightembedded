import { getLiveUpcomingEvents } from "@/server/actions/events";
import { EventMarqueeSection } from "@/components/event-marquee";

export default async function EventsSectionWrapper() {
  try {
    const events = await getLiveUpcomingEvents();
    return <EventMarqueeSection events={events} />;
  } catch (error) {
    console.error("Error in EventsSectionWrapper:", error);

    // Return a fallback UI if there's an error
    return (
      <section className="space-y-2">
        <div className="flex justify-center">
          <h2 className="text-2xl font-semibold">Upcoming Events</h2>
        </div>
        <p className="text-neutral-600 dark:text-neutral-400">
          Unable to load events at this time.
        </p>
      </section>
    );
  }
}
