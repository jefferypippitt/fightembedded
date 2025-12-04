import { z } from "zod";

export const eventSchema = z.object({
  name: z.string().min(2, "Event name is required"),
  date: z.date(),
  venue: z.string().min(2, "Venue is required"),
  location: z.string().min(2, "Location is required"),
  mainEvent: z.string().min(2, "Main event is required"),
  coMainEvent: z.string().optional(),
  status: z.enum(["UPCOMING", "COMPLETED", "CANCELLED"]),
});
