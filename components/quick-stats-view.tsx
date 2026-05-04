"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import type { Athlete, QuickStatsPageData, QuickStatsTopCountry } from "@/types/athlete";
import { AthleteAvatar } from "@/components/ui/athlete-avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getCountryCode } from "@/lib/country-codes";
import { cn } from "@/lib/utils";

function QuickStatRow({
  eyebrow,
  title,
  description,
  endSection,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  endSection?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-10",
        endSection &&
          "border-b border-border/50 pb-10 last:border-b-0 last:pb-0"
      )}
    >
      <div
        className={
          eyebrow
            ? "shrink-0 space-y-1.5 sm:max-w-[min(280px,40%)]"
            : "shrink-0 sm:max-w-[min(280px,40%)]"
        }
      >
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-lg font-medium tracking-tight text-foreground sm:text-xl">
          {title}
        </h2>
        {description ? (
          <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        ) : null}
      </div>
      <div className="min-w-0 flex-1 sm:flex sm:justify-end">{children}</div>
    </div>
  );
}

function recordLabel(athlete: Athlete) {
  const d = athlete.draws != null && athlete.draws > 0 ? `-${athlete.draws}` : "";
  return `${athlete.wins}-${athlete.losses}${d}`;
}

type QuickStatTooltipVariant =
  | "undefeated"
  | "champion"
  | "age"
  | "followers"
  | "newest"
  | "recentlyRetired"
  | "submissionRate"
  | "koRate";

const followersFormatter = new Intl.NumberFormat("en-US");

function addedDateLabel(createdAt: Date | string) {
  const d = typeof createdAt === "string" ? new Date(createdAt) : createdAt;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function finishRateLine(wins: number, kindWins: number, label: string) {
  if (wins <= 0) return "—";
  const pct = Math.round((kindWins / wins) * 1000) / 10;
  return `${label} ${pct}% (${kindWins} of ${wins} wins)`;
}

function TooltipLines({
  athlete,
  variant,
}: {
  athlete: Athlete;
  variant: QuickStatTooltipVariant;
}) {
  switch (variant) {
    case "undefeated":
      return (
        <>
          <span className="block font-medium leading-snug">{athlete.name}</span>
          <span className="mt-0.5 block text-xs leading-snug text-background/85">
            {recordLabel(athlete)}
          </span>
        </>
      );
    case "champion":
      return (
        <>
          <span className="block font-medium leading-snug">{athlete.name}</span>
          <span className="mt-0.5 block text-xs leading-snug text-background/85">
            {athlete.weightDivision}
          </span>
        </>
      );
    case "age":
      return (
        <>
          <span className="block font-medium leading-snug">{athlete.name}</span>
          <span className="mt-0.5 block text-xs leading-snug text-background/85">
            Age {athlete.age}
          </span>
        </>
      );
    case "followers":
      return (
        <>
          <span className="block font-medium leading-snug">{athlete.name}</span>
          <span className="mt-0.5 block text-xs leading-snug text-background/85">
            {followersFormatter.format(athlete.followers)} followers
          </span>
        </>
      );
    case "newest":
      return (
        <>
          <span className="block font-medium leading-snug">{athlete.name}</span>
          <span className="mt-0.5 block text-xs leading-snug text-background/85">
            Added {addedDateLabel(athlete.createdAt)}
          </span>
        </>
      );
    case "recentlyRetired":
      return (
        <>
          <span className="block font-medium leading-snug">{athlete.name}</span>
          <span className="mt-0.5 block text-xs leading-snug text-background/85">
            {recordLabel(athlete)}
          </span>
        </>
      );
    case "submissionRate":
      return (
        <>
          <span className="block font-medium leading-snug">{athlete.name}</span>
          <span className="mt-0.5 block text-xs leading-snug text-background/85">
            {finishRateLine(athlete.wins, athlete.winsBySubmission, "Sub rate:")}
          </span>
        </>
      );
    case "koRate":
      return (
        <>
          <span className="block font-medium leading-snug">{athlete.name}</span>
          <span className="mt-0.5 block text-xs leading-snug text-background/85">
            {finishRateLine(athlete.wins, athlete.winsByKo, "KO rate:")}
          </span>
        </>
      );
  }
}

function OverlappingAvatarStrip({
  athletes,
  tooltipVariant,
  emptyMessage = "No athletes to show.",
}: {
  athletes: Athlete[];
  tooltipVariant: QuickStatTooltipVariant;
  emptyMessage?: string;
}) {
  if (athletes.length === 0) {
    return (
      <p className="text-muted-foreground text-sm italic">{emptyMessage}</p>
    );
  }

  return (
    <div className="flex w-full min-w-0 justify-start overflow-x-auto pb-0.5 sm:justify-end">
      <div className="flex shrink-0 flex-row justify-end -space-x-2">
        {athletes.map((athlete) => (
          <Tooltip key={athlete.id}>
            <TooltipTrigger asChild>
              <span className="inline-flex shrink-0 cursor-default rounded-full ring-2 ring-background">
                <AthleteAvatar
                  imageUrl={athlete.imageUrl ?? undefined}
                  updatedAt={athlete.updatedAt}
                  countryCode={
                    athlete.country ? getCountryCode(athlete.country) : undefined
                  }
                  size="xs"
                  className="rounded-full"
                />
              </span>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              sideOffset={6}
              className="max-w-[min(240px,calc(100vw-2rem))] text-left break-words whitespace-normal"
            >
              <TooltipLines athlete={athlete} variant={tooltipVariant} />
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}

function OverlappingCountryFlagStrip({
  rows,
  emptyMessage = "No country data yet.",
}: {
  rows: QuickStatsTopCountry[];
  emptyMessage?: string;
}) {
  if (rows.length === 0) {
    return (
      <p className="text-muted-foreground text-sm italic">{emptyMessage}</p>
    );
  }

  return (
    <div className="flex w-full min-w-0 justify-start overflow-x-auto pb-0.5 sm:justify-end">
      <div className="flex shrink-0 flex-row justify-end -space-x-2">
        {rows.map((row) => {
          const code = getCountryCode(row.country);
          const flagSrc =
            code && code.length >= 2 && code.length <= 10
              ? `https://flagcdn.com/${code.toLowerCase()}.svg`
              : null;

          return (
            <Tooltip key={row.country}>
              <TooltipTrigger asChild>
                <span className="inline-flex shrink-0 cursor-default rounded-full ring-2 ring-background">
                  <span className="relative block h-12 w-12 overflow-hidden rounded-full bg-muted">
                    {flagSrc ? (
                      <Image
                        src={flagSrc}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="48px"
                        unoptimized
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-xs font-medium text-muted-foreground">
                        ?
                      </span>
                    )}
                  </span>
                </span>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                sideOffset={6}
                className="max-w-[min(240px,calc(100vw-2rem))] text-left break-words whitespace-normal"
              >
                <span className="block font-medium leading-snug">{row.country}</span>
                <span className="mt-0.5 block text-xs leading-snug text-background/85">
                  {row.count} active {row.count === 1 ? "athlete" : "athletes"}
                </span>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}

export function QuickStatsView({ data }: { data: QuickStatsPageData }) {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-10">
        <QuickStatRow eyebrow="Records" title="Undefeated Athletes">
          <OverlappingAvatarStrip
            athletes={data.undefeated}
            tooltipVariant="undefeated"
          />
        </QuickStatRow>

        <QuickStatRow title="Current Champions" endSection>
          <OverlappingAvatarStrip
            athletes={data.currentChampions}
            tooltipVariant="champion"
            emptyMessage="No champions on file."
          />
        </QuickStatRow>

        <QuickStatRow eyebrow="Audience" title="Most Followed Active">
          <OverlappingAvatarStrip
            athletes={data.mostFollowed}
            tooltipVariant="followers"
          />
        </QuickStatRow>

        <QuickStatRow title="Most Followed Retired" endSection>
          <OverlappingAvatarStrip
            athletes={[
              ...data.mostFollowedRetiredMale,
              ...data.mostFollowedRetiredFemale,
            ]}
            tooltipVariant="followers"
            emptyMessage="No retired athletes on file."
          />
        </QuickStatRow>

        <QuickStatRow eyebrow="Roster" title="Recent Additions">
          <OverlappingAvatarStrip
            athletes={data.newestAdded}
            tooltipVariant="newest"
            emptyMessage="No active athletes on file."
          />
        </QuickStatRow>

        <QuickStatRow title="Recent Retired" endSection>
          <OverlappingAvatarStrip
            athletes={data.recentlyRetired}
            tooltipVariant="recentlyRetired"
            emptyMessage="No retired athletes on file."
          />
        </QuickStatRow>

        <QuickStatRow eyebrow="Finishes" title="Submission Rate Leaders">
          <OverlappingAvatarStrip
            athletes={data.bestSubmissionRate}
            tooltipVariant="submissionRate"
            emptyMessage="No fighters with enough wins for a submission-rate snapshot yet."
          />
        </QuickStatRow>

        <QuickStatRow title="Knockout Rate Leaders" endSection>
          <OverlappingAvatarStrip
            athletes={data.bestKoRate}
            tooltipVariant="koRate"
            emptyMessage="No fighters with enough wins for a knockout-rate snapshot yet."
          />
        </QuickStatRow>

        <QuickStatRow eyebrow="Geography" title="Top Countries">
          <OverlappingCountryFlagStrip rows={data.topCountries} />
        </QuickStatRow>

        <QuickStatRow title="Least Represented" endSection>
          <OverlappingCountryFlagStrip
            rows={data.leastCountries}
            emptyMessage="Fewer than nine nations on the roster — everyone is already in the top list."
          />
        </QuickStatRow>

        <QuickStatRow eyebrow="Experience" title="Oldest Active Athletes">
          <OverlappingAvatarStrip
            athletes={data.oldest}
            tooltipVariant="age"
          />
        </QuickStatRow>

        <QuickStatRow title="Youngest Active Athletes" endSection>
          <OverlappingAvatarStrip
            athletes={data.youngest}
            tooltipVariant="age"
          />
        </QuickStatRow>
      </div>
    </TooltipProvider>
  );
}
