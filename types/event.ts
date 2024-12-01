import { z } from "zod";
import { eventSchema } from "@/schemas/event";

export type EventInput = z.infer<typeof eventSchema>;

export type UFCEvent = {
  id: string;
  name: string;
  date: Date;
  venue: string;
  location: string;
  mainEvent: string;
  imageUrl?: string | null;
  status: "UPCOMING" | "COMPLETED" | "CANCELLED";
  createdAt: Date;
  updatedAt: Date;
};

export type ActionResponse = {
  status: "success" | "error";
  message: string;
  data?: UFCEvent;
};
