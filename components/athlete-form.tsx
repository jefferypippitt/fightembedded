"use client";

import { useRouter } from "next/navigation";

import { useFormStatus } from "react-dom";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";

import { toast } from "@/hooks/use-toast";
import { createAthlete } from "@/server/actions/create-athlete";
import { updateAthlete } from "@/server/actions/update-athlete";
import { athleteSchema } from "@/schemas/athlete";

import { z } from "zod";

import { useRef } from "react";

import { weightClasses } from "@/data/weight-class";
import { countries } from "@/data/countries";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ControllerRenderProps } from "react-hook-form";

type AthleteFormProps = {
  initialData?: z.infer<typeof athleteSchema> & { id: string };
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit"}
    </Button>
  );
}

type FormValues = z.infer<typeof athleteSchema> & { id?: string };

function CountrySelect({
  field,
}: {
  field: ControllerRenderProps<FormValues, "country">;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(field.value || "");

  return (
    <FormItem className="flex flex-col">
      <FormLabel className="text-sm">Country</FormLabel>
      <FormControl>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between h-9"
            >
              {value
                ? countries.find((country) => country.name === value)?.name
                : "Select country..."}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder="Search country..." className="h-9" />
              <CommandList>
                <CommandEmpty>No country found.</CommandEmpty>
                <CommandGroup>
                  {countries.map((country) => (
                    <CommandItem
                      key={country.name}
                      value={country.name}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        field.onChange(currentValue);
                        setOpen(false);
                      }}
                    >
                      {country.name}
                      <Check
                        className={cn(
                          "ml-auto",
                          value === country.name ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </FormControl>
      <FormMessage className="text-xs" />
    </FormItem>
  );
}

export function AthleteForm({ initialData }: AthleteFormProps) {
  const router = useRouter();

  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<FormValues>({
    defaultValues: initialData || {
      name: "",
      gender: undefined,
      age: 0,
      country: "",
      weightDivision: "",
      wins: 0,
      losses: 0,
      draws: 0,
      koRate: 0,
      submissionRate: 0,
      followers: 0,
      rank: 0,
      poundForPoundRank: 0,
      imageUrl: "",
    },
    resolver: zodResolver(athleteSchema),
  });

  async function onSubmit(data: z.infer<typeof athleteSchema>) {
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value?.toString() || "0");
      });

      const result = initialData
        ? await updateAthlete(initialData.id, formData)
        : await createAthlete(formData);

      if (result.status === "success") {
        toast({
          title: "Success",

          description: result.message,
        });

        router.push("/athletes");

        router.refresh();
      } else {
        toast({
          title: "Submission Error",

          description:
            result.message ||
            "Failed to save athlete data. Please check all fields and try again.",

          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);

      toast({
        title: "Error",

        description:
          error instanceof Error
            ? `Error: ${error.message}`
            : "An unexpected error occurred. Please try again.",

        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* Personal Information Section */}

        <div className="bg-card p-4 rounded-lg border shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-4 w-1 bg-primary rounded-full" />

            <h2 className="text-lg font-semibold">Personal Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Name</FormLabel>

                  <FormControl>
                    <Input
                      className="h-9"
                      placeholder="Athlete Name"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Gender</FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>

                      <SelectItem value="FEMALE">Female</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Age</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Age"
                      className="h-9"
                      type="number"
                      min={18}
                      max={65}
                      {...field}
                      value={field.value === 0 ? "" : field.value}
                      onChange={(e) => {
                        const value =
                          e.target.value === "" ? 0 : parseInt(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => <CountrySelect field={field} />}
            />

            <FormField
              control={form.control}
              name="weightDivision"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Weight Division</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    defaultValue={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select weight division" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Mens Divisions</SelectLabel>
                        {weightClasses.men.map((division) => (
                          <SelectItem
                            key={division.slug}
                            value={`Men's ${division.name}`}
                          >
                            {division.name}{" "}
                            {division.weight && `(${division.weight}lbs)`}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>Womens Divisions</SelectLabel>
                        {weightClasses.women.map((division) => (
                          <SelectItem
                            key={division.slug}
                            value={`Women's ${division.name}`}
                          >
                            {division.name}{" "}
                            {division.weight && `(${division.weight}lbs)`}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rank"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Rank</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Rank"
                      className="h-9"
                      type="number"
                      min={1}
                      {...field}
                      value={field.value === 0 ? "" : field.value}
                      onChange={(e) => {
                        const value =
                          e.target.value === "" ? 0 : parseInt(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="poundForPoundRank"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">
                    Pound for Pound Rank
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Pound for Pound Rank"
                      className="h-9"
                      type="number"
                      min={1}
                      max={15}
                      {...field}
                      value={field.value === 0 ? "" : field.value}
                      onChange={(e) => {
                        const value =
                          e.target.value === "" ? 0 : parseInt(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Fight Record Section */}

        <div className="bg-card p-4 rounded-lg border shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-4 w-1 bg-primary rounded-full" />

            <h2 className="text-lg font-semibold">Fight Record</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="wins"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Wins</FormLabel>

                  <FormControl>
                    <Input
                      className="h-9"
                      placeholder="Wins"
                      type="number"
                      min={0}
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const value =
                          e.target.value === ""
                            ? undefined
                            : parseInt(e.target.value);

                        field.onChange(value);
                      }}
                    />
                  </FormControl>

                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="losses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Losses</FormLabel>
                  <FormControl>
                    <Input
                      className="h-9"
                      placeholder="Losses"
                      type="number"
                      min={0}
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const value =
                          e.target.value === ""
                            ? undefined
                            : parseInt(e.target.value);

                        field.onChange(value);
                      }}
                    />
                  </FormControl>

                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="draws"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Draws</FormLabel>

                  <FormControl>
                    <Input
                      className="h-9"
                      placeholder="Draws"
                      type="number"
                      min={0}
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const value =
                          e.target.value === ""
                            ? undefined
                            : parseInt(e.target.value);

                        field.onChange(value);
                      }}
                    />
                  </FormControl>

                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Performance Stats Section */}

        <div className="bg-card p-4 rounded-lg border shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-4 w-1 bg-primary rounded-full" />

            <h2 className="text-lg font-semibold">Performance Stats</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="koRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Wins by Knock Out</FormLabel>

                  <FormControl>
                    <Input
                      className="h-9"
                      placeholder="Wins by Knock Out"
                      type="number"
                      min={0}
                      max={100}
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const value =
                          e.target.value === ""
                            ? undefined
                            : parseInt(e.target.value);

                        field.onChange(value);
                      }}
                    />
                  </FormControl>

                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="submissionRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Wins by Submission</FormLabel>

                  <FormControl>
                    <Input
                      className="h-9"
                      placeholder="Wins by Submission"
                      type="number"
                      min={0}
                      max={100}
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const value =
                          e.target.value === ""
                            ? undefined
                            : parseInt(e.target.value);

                        field.onChange(value);
                      }}
                    />
                  </FormControl>

                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="followers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Followers</FormLabel>

                  <FormControl>
                    <Input
                      className="h-9"
                      placeholder="Followers"
                      type="number"
                      min={0}
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const value =
                          e.target.value === ""
                            ? undefined
                            : parseInt(e.target.value);

                        field.onChange(value);
                      }}
                    />
                  </FormControl>

                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-left">
          <SubmitButton />
        </div>
      </form>
    </Form>
  );
}
