import { eventSchema } from "@/schemas/event";
import type { EventInput } from "@/types/event";

export function eventInputFromFormData(formData: FormData): EventInput {
  const rawData = Object.fromEntries(formData.entries());

  const data = {
    name: String(rawData.name),
    date: new Date(String(rawData.date)),
    venue: String(rawData.venue),
    location: String(rawData.location),
    mainEvent: String(rawData.mainEvent),
    coMainEvent: rawData.coMainEvent
      ? String(rawData.coMainEvent)
      : undefined,
    status: String(rawData.status) as "UPCOMING" | "COMPLETED" | "CANCELLED",
  };

  return eventSchema.parse(data);
}
