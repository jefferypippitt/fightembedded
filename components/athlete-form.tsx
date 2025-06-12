"use client";

import { useRouter } from "next/navigation";
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
import { UploadButton } from "@/utils/uploadthing";
import { useState } from "react";
import { AthleteAvatar } from "@/components/ui/athlete-avatar";
import { getCountryCode } from "@/lib/country-codes";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";

import { toast } from "sonner";
import { createAthlete } from "@/server/actions/create-athlete";
import { updateAthlete } from "@/server/actions/update-athlete";
import { athleteSchema } from "@/schemas/athlete";

import { z } from "zod";

import { useRef } from "react";

import { weightClasses } from "@/data/weight-class";
import { countries } from "@/data/countries";
import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type AthleteFormProps = {
  initialData?: z.infer<typeof athleteSchema> & { id: string };
};

function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <Button type="submit" disabled={isSubmitting}>
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </>
      ) : (
        "Submit"
      )}
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
  const [imageUrl, setImageUrl] = useState<string>(initialData?.imageUrl || "");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<FormValues>({
    defaultValues: {
      ...initialData,
      winsByKo: initialData?.winsByKo ?? 0,
      winsBySubmission: initialData?.winsBySubmission ?? 0,
      name: initialData?.name || "",
      gender: initialData?.gender || undefined,
      age: initialData?.age || 0,
      country: initialData?.country || "",
      weightDivision: initialData?.weightDivision || "",
      wins: initialData?.wins || 0,
      losses: initialData?.losses || 0,
      draws: initialData?.draws || 0,
      followers: initialData?.followers || 0,
      rank: initialData?.rank || 0,
      poundForPoundRank: initialData?.poundForPoundRank || 0,
      imageUrl: initialData?.imageUrl || "",
      retired: Boolean(initialData?.retired),
    },
    resolver: zodResolver(athleteSchema),
  });

  // Reset form when initialData changes
  React.useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        winsByKo: initialData.winsByKo ?? 0,
        winsBySubmission: initialData.winsBySubmission ?? 0,
        name: initialData.name || "",
        gender: initialData.gender || undefined,
        age: initialData.age || 0,
        country: initialData.country || "",
        weightDivision: initialData.weightDivision || "",
        wins: initialData.wins || 0,
        losses: initialData.losses || 0,
        draws: initialData.draws || 0,
        followers: initialData.followers || 0,
        rank: initialData.rank || 0,
        poundForPoundRank: initialData.poundForPoundRank || 0,
        imageUrl: initialData.imageUrl || "",
        retired: Boolean(initialData.retired),
      });
      setImageUrl(initialData.imageUrl || "");
    }
  }, [initialData, form]);

  async function onSubmit(data: z.infer<typeof athleteSchema>) {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        } else {
          formData.append(key, "0");
        }
      });

      formData.set("retired", data.retired ? "true" : "false");

      if (imageUrl) {
        formData.set("imageUrl", imageUrl);
      }

      const result = initialData
        ? await updateAthlete(initialData.id, formData)
        : await createAthlete(formData);

      if (result.status === "success") {
        toast.success(result.message);
        // Force a hard refresh of the page to ensure fresh data
        router.refresh();
        router.push("/dashboard/athletes");
      } else {
        toast.error(
          result.message ||
            "Failed to save athlete data. Please check all fields and try again."
        );
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(
        error instanceof Error
          ? `Error: ${error.message}`
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* Add Image Upload Section */}
        <div className="bg-card p-4 rounded-lg border shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold">Profile Image</h2>
          </div>

          <div className="flex items-center gap-6">
            <AthleteAvatar
              imageUrl={imageUrl}
              countryCode={getCountryCode(form.watch("country"))}
              size="md"
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <UploadButton
                      endpoint="athleteImage"
                      appearance={{
                        button: "ut-button",
                        allowedContent: "hidden",
                      }}
                      content={{
                        button() {
                          return (
                            <>
                              {isUploading ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  <span>Uploading...</span>
                                </>
                              ) : (
                                <>
                                  <span>Choose file</span>
                                </>
                              )}
                            </>
                          );
                        },
                      }}
                      onUploadProgress={() => {
                        setIsUploading(true);
                      }}
                      onClientUploadComplete={(res) => {
                        setIsUploading(false);
                        if (res?.[0]) {
                          const url = res[0].ufsUrl;
                          setImageUrl(url);
                          field.onChange(url);
                          toast.success("Image uploaded successfully");
                        }
                      }}
                      onUploadError={(error: Error) => {
                        setIsUploading(false);
                        toast.error(error.message);
                      }}
                      disabled={isUploading}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
        </div>
        {/* Personal Information Section */}
        <div className="bg-card p-6 rounded-lg border shadow-xs">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-xl font-semibold">Personal Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Basic Info Group */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Name</FormLabel>
                    <FormControl>
                      <Input
                        className="h-10"
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
                    <FormLabel className="text-sm font-medium">
                      Gender
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger className="h-10">
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
                    <FormLabel className="text-sm font-medium">Age</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Age"
                        className="h-10"
                        type="number"
                        min={18}
                        max={65}
                        {...field}
                        value={field.value === 0 ? "" : field.value}
                        onChange={(e) => {
                          const value =
                            e.target.value === ""
                              ? 0
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

            {/* Division & Country Group */}
            <div className="space-y-4">
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
                    <FormLabel className="text-sm font-medium">
                      Weight Division
                    </FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      defaultValue={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger className="h-10">
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
            </div>

            {/* Rankings & Status Group */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="rank"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Rank
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Rank"
                          className="h-10"
                          type="number"
                          min={1}
                          {...field}
                          value={field.value === 0 ? "" : field.value}
                          onChange={(e) => {
                            const value =
                              e.target.value === ""
                                ? 0
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
                  name="poundForPoundRank"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        P4P Rank
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="P4P Rank"
                          className="h-10"
                          type="number"
                          min={1}
                          max={15}
                          {...field}
                          value={field.value === 0 ? "" : field.value}
                          onChange={(e) => {
                            const value =
                              e.target.value === ""
                                ? 0
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

              <FormField
                control={form.control}
                name="retired"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-medium">
                      Fighter Status
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          field.onChange(value === "retired");
                        }}
                        value={field.value ? "retired" : "active"}
                        className="flex flex-col space-y-2"
                      >
                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <RadioGroupItem value="active" />
                          </FormControl>
                          <FormLabel className="font-normal">Active</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <RadioGroupItem value="retired" />
                          </FormControl>
                          <FormLabel className="font-normal">Retired</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Fight Record Section */}
        <div className="bg-card p-4 rounded-lg border shadow-xs">
          <div className="flex items-center gap-2 mb-4">
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

        {/* Performance Stats Section */}

        <div className="bg-card p-4 rounded-lg border shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold">Performance Stats</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="winsByKo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Wins by KO/TKO</FormLabel>
                  <FormControl>
                    <Input
                      className="h-9"
                      placeholder="Enter KO/TKO wins"
                      type="number"
                      min={0}
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
              name="winsBySubmission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Wins by Submission</FormLabel>
                  <FormControl>
                    <Input
                      className="h-9"
                      placeholder="Enter submission wins"
                      type="number"
                      min={0}
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

        <div className="flex justify-left">
          <SubmitButton isSubmitting={isSubmitting} />
        </div>
      </form>
    </Form>
  );
}
