import { EventForm } from "@/components/event-form";
import { Suspense } from "react";

export default function NewEventPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <Suspense fallback={<div className="h-64 animate-pulse rounded-md bg-muted" />}>
              <EventForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
