import { EventForm } from "@/components/event-form";
import { getEvent } from "@/server/actions/get-event";
import { notFound } from "next/navigation";
import { UFCEvent } from "@/types/event";

export default async function EditEventPage({
  params,
}: {
  params: { id: string };
}) {
  const event = await getEvent(params.id);

  if (!event) {
    notFound();
  }

  const typedEvent: UFCEvent = {
    ...event,
    status: event.status as "UPCOMING" | "COMPLETED" | "CANCELLED"
  };

  return (
    <div className="container max-w-7xl mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Edit Event</h1>
      <EventForm initialData={typedEvent} />
    </div>
  );
}
