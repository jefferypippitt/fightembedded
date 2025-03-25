import { EventForm } from "@/components/event-form";
import { getEvent } from "@/server/actions/get-event";
import { notFound } from "next/navigation";
import { UFCEvent } from "@/types/event";
import { Metadata } from "next";

interface GenerateMetadataProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const event = await getEvent(id);
    return {
      title: `Edit ${event?.name || "Event"}`,
      description: `Edit details for ${event?.name || "event"}`,
    };
  } catch {
    return {
      title: "Edit Event",
      description: "Edit event information",
    };
  }
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: PageProps) {
  // Await the params to access its properties
  const { id } = await params;

  try {
    // Fetch the event using the provided ID
    const event = await getEvent(id);

    // Check if the event was found
    if (!event) {
      return notFound(); // Handle the case where the event does not exist
    }

    const typedEvent: UFCEvent = {
      ...event,
      status: event.status as "UPCOMING" | "COMPLETED" | "CANCELLED",
    };

    return (
      <div className="py-4">
        <h1 className="text-xl font-bold mb-6">Edit Event</h1>
        <EventForm initialData={typedEvent} />
      </div>
    );
  } catch (error) {
    console.error("Error preparing edit form:", error);
    return notFound();
  }
}