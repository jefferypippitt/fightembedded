import { EventForm } from "@/components/event-form";
import { getEventForEdit } from "@/server/actions/events";
import { notFound } from "next/navigation";

async function EditEventContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let event;

  try {
    event = await getEventForEdit(id);
  } catch (error) {
    console.error("Error loading event for edit:", error);
    notFound();
  }

  if (!event) {
    notFound();
  }

  return <EventForm initialData={event} />;
}

export default function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-2 py-2 md:gap-2 md:py-2">
          <div className="px-4 lg:px-6">
            <EditEventContent params={params} />
          </div>
        </div>
      </div>
    </div>
  );
}