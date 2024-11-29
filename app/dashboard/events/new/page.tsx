import { EventForm } from "@/components/event-form";

export default function NewEventPage() {
  return (
    <div className="py-4">
      <h1 className="text-xl font-bold mb-6">Add New Event</h1>
      <EventForm />
    </div>
  );
} 