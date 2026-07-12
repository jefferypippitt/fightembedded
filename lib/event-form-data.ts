import { eventSchema } from "@/schemas/event";
import type { EventInput } from "@/types/event";

function stringOrUndefined(
  value: FormDataEntryValue | undefined
): string | undefined {
  return value === undefined ? undefined : String(value);
}

export function eventInputFromFormData(formData: FormData): EventInput {
  const rawData = Object.fromEntries(formData.entries());

  const data = {
    name: stringOrUndefined(rawData.name) ?? "",
    date: new Date(String(rawData.date)),
    venue: stringOrUndefined(rawData.venue) ?? "",
    location: stringOrUndefined(rawData.location) ?? "",
    mainEvent: stringOrUndefined(rawData.mainEvent) ?? "",
    coMainEvent: rawData.coMainEvent
      ? String(rawData.coMainEvent)
      : undefined,
    status: String(rawData.status) as "UPCOMING" | "COMPLETED" | "CANCELLED",
  };

  return eventSchema.parse(data);
}
