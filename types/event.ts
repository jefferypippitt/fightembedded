import { z } from "zod";
import { eventSchema } from "@/schemas/event";

// Base event schema for form inputs
export type EventInput = z.infer<typeof eventSchema>;

// Main event type used throughout the application
export type Event = {
  id: string;
  name: string;
  date: Date;
  venue: string;
  location: string;
  mainEvent: string;
  status: "UPCOMING" | "COMPLETED";
  createdAt: Date;
  updatedAt: Date;
};

// Generic response type for server actions
export type ActionResponse<T = unknown> = {
  status: "success" | "error";
  message: string;
  data?: T;
};

// Alias for backward compatibility
export type UFCEvent = Event;
