import { z } from "zod";

export const eventSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").nonempty("Name is required"),
  date: z.coerce.date(),
  venue: z.string().min(2, "Venue must be at least 2 characters").nonempty("Venue is required"),
  location: z.string().min(2, "Location must be at least 2 characters").nonempty("Location is required"),
  mainEvent: z.string().min(2, "Main event must be at least 2 characters").nonempty("Main event is required"),
  coMainEvent: z.string().optional(),
  imageUrl: z.string().optional(),
  status: z.enum(["UPCOMING", "COMPLETED", "CANCELLED"]).default("UPCOMING"),
});
