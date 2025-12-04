"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema } from "@/schemas/event";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createEvent, updateEvent } from "@/server/actions/events";
import { toast } from "sonner";
import { Event } from "@/types/event";
import { useState } from "react";
import { z } from "zod";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type EventFormProps = {
  initialData?: Event;
};

type EventFormData = z.infer<typeof eventSchema>;

export function EventForm({ initialData }: EventFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues: EventFormData = initialData
    ? {
        name: initialData.name,
        date: new Date(initialData.date),
        venue: initialData.venue,
        location: initialData.location,
        mainEvent: initialData.mainEvent,
        coMainEvent: initialData.coMainEvent || "",
        status: initialData.status || "UPCOMING",
      }
    : {
        name: "",
        date: new Date(),
        venue: "",
        location: "",
        mainEvent: "",
        coMainEvent: "",
        status: "UPCOMING",
      };

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues,
  });

  async function onSubmit(data: EventFormData) {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else if (value) {
          formData.append(key, String(value));
        }
      });

      const response = initialData
        ? await updateEvent(initialData.id, formData)
        : await createEvent(formData);

      if (response.status === "error") {
        throw new Error(response.message);
      }

      toast.success(response.message);
      router.push("/dashboard/events");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Event Details</FieldLegend>
          <FieldDescription>Basic information about the event</FieldDescription>
          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="name">Event Name</FieldLabel>
                    <Input id="name" placeholder="UFC 300" {...field} />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="date"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="date">Event Date</FieldLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="date"
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal h-9",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="venue"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="venue">Venue</FieldLabel>
                    <Input id="venue" placeholder="T-Mobile Arena" {...field} />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="location"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="location">Location</FieldLabel>
                    <Input
                      id="location"
                      placeholder="Las Vegas, Nevada"
                      {...field}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="mainEvent"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="mainEvent">Main Event</FieldLabel>
                    <Input
                      id="mainEvent"
                      placeholder="Fighter 1 vs Fighter 2"
                      {...field}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="coMainEvent"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="coMainEvent">Co-Main Event</FieldLabel>
                    <Input
                      id="coMainEvent"
                      placeholder="Fighter 1 vs Fighter 2"
                      {...field}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="status"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="status">Event Status</FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="status" className="w-full">
                        <SelectValue placeholder="Select event status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UPCOMING">Upcoming</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            </div>
          </FieldGroup>
        </FieldSet>

        <Field orientation="horizontal">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : initialData
              ? "Update Event"
              : "Create Event"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
