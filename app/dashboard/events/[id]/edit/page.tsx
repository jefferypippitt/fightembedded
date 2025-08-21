import { EventForm } from "@/components/event-form";
import { getEvent } from "@/server/actions/events";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: PageProps) {
  const { id } = await params;

  try {
    const event = await getEvent(id);

    if (!event) {
      return notFound();
    }

    return (
      <>
        <SiteHeader title="Edit Event" />
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
  } catch (error) {
    console.error("Error preparing edit form:", error);
    return notFound();
  }
}
