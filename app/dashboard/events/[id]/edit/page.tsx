import { EventForm } from "@/components/event-form";
import { getEvent } from "@/server/actions/events";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  let event;

  try {
    event = await getEvent(id);
  } catch (error) {
    console.error("Error loading event for edit:", error);
    notFound();
  }

  if (!event) {
    notFound();
  }

  const eventName = event.name || "Event";

  return (
    <>
      <SiteHeader title={`Edit Event › ${eventName}`} />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-2 py-2 md:gap-2 md:py-2">
            <div className="px-4 lg:px-6">
              <EventForm initialData={event} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
