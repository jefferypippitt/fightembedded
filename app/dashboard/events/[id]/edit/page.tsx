import { Suspense } from "react";
import { EventForm } from "@/components/event-form";
import { getEvent } from "@/server/actions/events";
import { notFound } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

async function EditEventForm({ id }: { id: string }) {
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

  return <EventForm initialData={event} />;
}

function EditEventFormSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-2 py-2 md:gap-2 md:py-2">
          <div className="px-4 lg:px-6">
            <Suspense fallback={<EditEventFormSkeleton />}>
              <EditEventForm id={id} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
