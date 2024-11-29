import { EventForm } from "@/components/event-form";
import { getEvent } from "@/server/actions/get-event";
import { notFound } from "next/navigation";
import { UFCEvent } from "@/types/event";

export default async function EditEventPage({
  params,
}: {
  params: { id: string };
}) {
  // Await the params to access its properties
  const { id } = await params;

  // Fetch the event using the provided ID
  const event = await getEvent(id);

  // Check if the event was found
  if (!event) {
    notFound(); // Handle the case where the event does not exist
  }

  const typedEvent: UFCEvent = {
    ...event,
    status: event.status as "UPCOMING" | "COMPLETED" | "CANCELLED",
  };

  return (
    <div className="container max-w-7xl mx-auto py-6 px-4">
      <h1 className="text-xl font-bold">Create New Event</h1>
      <EventForm initialData={typedEvent} />
    </div>
  );
}
