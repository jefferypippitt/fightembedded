import { EventForm } from "@/components/event-form";
import { SiteHeader } from "@/components/site-header";

export default function NewEventPage() {
  return (
    <>
      <SiteHeader title="Add New Event" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-2 py-2 md:gap-2 md:py-2">
            <div className="px-4 lg:px-6">
              <EventForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
