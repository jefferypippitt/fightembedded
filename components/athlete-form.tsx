"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldError,
} from "@/components/ui/field";

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
import { createAthlete } from "@/server/actions/athlete";
import { updateAthlete } from "@/server/actions/athlete";

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
  error,
}: {
  field: ControllerRenderProps<FormValues, "country">;
  error?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(field.value || "");

  // Sync internal state with field value changes (e.g., when form resets)
  React.useEffect(() => {
    setValue(field.value || "");
  }, [field.value]);

  return (
    <Field>
      <FieldLabel htmlFor="country-select">Country</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="country-select"
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
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}

export function AthleteForm({ initialData }: AthleteFormProps) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string>(initialData?.imageUrl || "");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<FormValues>({
    defaultValues: initialData
      ? {
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
        }
      : {
          winsByKo: 0,
          winsBySubmission: 0,
          name: "",
          gender: undefined,
          age: 0,
          country: "",
          weightDivision: "",
          wins: 0,
          losses: 0,
          draws: 0,
          followers: 0,
          rank: 0,
          poundForPoundRank: 0,
          imageUrl: "",
          retired: false,
        },
    resolver: zodResolver(athleteSchema),
  });

  // Watch the retired field to disable rank fields
  const isRetired = form.watch("retired");

  // Reset form when initialData changes (for edit mode) or on mount (for new form)
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
    } else {
      // Ensure form is reset to empty values when initialData is undefined (new form)
      form.reset({
        winsByKo: 0,
        winsBySubmission: 0,
        name: "",
        gender: undefined,
        age: 0,
        country: "",
        weightDivision: "",
        wins: 0,
        losses: 0,
        draws: 0,
        followers: 0,
        rank: 0,
        poundForPoundRank: 0,
        imageUrl: "",
        retired: false,
      });
      setImageUrl("");
    }
  }, [initialData, form]);

  // Clear rank fields when athlete is marked as retired
  React.useEffect(() => {
    if (isRetired) {
      form.setValue("rank", 0);
      form.setValue("poundForPoundRank", 0);
    }
  }, [isRetired, form]);

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
        // Navigate away - server action will revalidate the new form route
        router.replace("/dashboard/athletes");
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
    <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Profile Image</FieldLegend>
          <FieldDescription>
            Upload a profile image for the athlete
          </FieldDescription>
          <Controller
            control={form.control}
            name="imageUrl"
            render={({ field, fieldState }) => (
              <Field>
                <div className="flex flex-col items-start gap-4">
                  <AthleteAvatar
                    className="border-2 border-dotted border-foreground/40"
                    imageUrl={imageUrl}
                    countryCode={getCountryCode(form.watch("country"))}
                    size="lg"
                    priority={false}
                  />
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
                </div>
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
        </FieldSet>
        <FieldSeparator />
        <FieldSet>
          <FieldLegend>Personal Information</FieldLegend>
          <FieldDescription>
            Basic information about the athlete
          </FieldDescription>
          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input id="name" placeholder="Athlete Name" {...field} />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="gender"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="gender">Gender</FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <SelectTrigger id="gender" className="w-full">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="age"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="age">Age</FieldLabel>
                    <Input
                      id="age"
                      placeholder="Age"
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
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="retired"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Fighter Status</FieldLabel>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value === "retired");
                      }}
                      value={field.value ? "retired" : "active"}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="active" id="active" />
                        <FieldLabel htmlFor="active" className="font-normal">
                          Active
                        </FieldLabel>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="retired" id="retired" />
                        <FieldLabel htmlFor="retired" className="font-normal">
                          Retired
                        </FieldLabel>
                      </div>
                    </RadioGroup>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="country"
                render={({ field, fieldState }) => (
                  <CountrySelect
                    field={field}
                    error={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                control={form.control}
                name="weightDivision"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="weightDivision">
                      Weight Division
                    </FieldLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value || ""}
                    >
                      <SelectTrigger id="weightDivision" className="w-full">
                        <SelectValue placeholder="Select weight division" />
                      </SelectTrigger>
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
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="rank"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="rank">Rank</FieldLabel>
                    <Input
                      id="rank"
                      placeholder="Rank"
                      type="number"
                      min={1}
                      disabled={isRetired}
                      {...field}
                      value={field.value === 0 ? "" : field.value}
                      onChange={(e) => {
                        const value =
                          e.target.value === "" ? 0 : parseInt(e.target.value);
                        field.onChange(value);
                      }}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="poundForPoundRank"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="poundForPoundRank">
                      P4P Rank
                    </FieldLabel>
                    <Input
                      id="poundForPoundRank"
                      placeholder="P4P Rank"
                      type="number"
                      min={1}
                      max={15}
                      disabled={isRetired}
                      {...field}
                      value={field.value === 0 ? "" : field.value}
                      onChange={(e) => {
                        const value =
                          e.target.value === "" ? 0 : parseInt(e.target.value);
                        field.onChange(value);
                      }}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            </div>
            {isRetired && (
              <FieldDescription>
                Rank fields are disabled for retired athletes and will be
                automatically cleared.
              </FieldDescription>
            )}
          </FieldGroup>
        </FieldSet>

        <FieldSeparator />
        <FieldSet>
          <FieldLegend>Fight Record</FieldLegend>
          <FieldDescription>
            Win-loss-draw record for the athlete
          </FieldDescription>
          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Controller
                control={form.control}
                name="wins"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="wins">Wins</FieldLabel>
                    <Input
                      id="wins"
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
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="losses"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="losses">Losses</FieldLabel>
                    <Input
                      id="losses"
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
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="draws"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="draws">Draws</FieldLabel>
                    <Input
                      id="draws"
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
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            </div>
          </FieldGroup>
        </FieldSet>

        <FieldSeparator />
        <FieldSet>
          <FieldLegend>Performance Stats</FieldLegend>
          <FieldDescription>
            Detailed statistics about wins and social following
          </FieldDescription>
          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Controller
                control={form.control}
                name="winsByKo"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="winsByKo">Wins by KO/TKO</FieldLabel>
                    <Input
                      id="winsByKo"
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
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="winsBySubmission"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="winsBySubmission">
                      Wins by Submission
                    </FieldLabel>
                    <Input
                      id="winsBySubmission"
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
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="followers"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="followers">Followers</FieldLabel>
                    <Input
                      id="followers"
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
          <SubmitButton isSubmitting={isSubmitting} />
        </Field>
      </FieldGroup>
    </form>
  );
}
