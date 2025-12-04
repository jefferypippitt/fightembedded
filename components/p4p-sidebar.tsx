"use client";

import { Fragment, memo } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AthleteAvatar } from "@/components/ui/athlete-avatar";
import { getCountryCode } from "@/lib/country-codes";
import { Fighter, P4PSidebarProps } from "@/types/rankings";
import PrefetchLink from "@/components/prefetch-link";
import { getAllDivisions } from "@/data/weight-class";

const divisionSlugMap = getAllDivisions().reduce<Record<string, string>>(
  (acc, division) => {
    acc[division.name.toLowerCase()] = division.slug;
    return acc;
  },
  {}
);

const getDivisionHref = (fighter: Fighter): string => {
  const divisionName = fighter.weightDivision?.toLowerCase();
  if (!divisionName) return "/athletes";

  const slug = divisionSlugMap[divisionName];
  if (!slug) return "/athletes";

  return `/division/${slug}`;
};

interface FighterCardProps {
  fighter: Fighter;
  isPriority?: boolean;
}

const FighterCard = memo(function FighterCard({
  fighter,
  isPriority = false,
}: FighterCardProps) {
  const countryCode = getCountryCode(fighter.country);

  const href = getDivisionHref(fighter);

  return (
    <li>
      <PrefetchLink
        href={href}
        className="relative block h-16 overflow-hidden rounded-sm border bg-card transition-all duration-300 shadow-xs group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2"
      >
        <div className="relative flex h-full items-center gap-2 p-2">
          <span className="px-2.5 text-xs">{fighter.poundForPoundRank}.</span>
          <AthleteAvatar
            imageUrl={fighter.imageUrl}
            countryCode={countryCode}
            size="xs"
            priority={isPriority}
          />
          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <p className="mb-1 text-xs font-medium">
              {fighter.name}
            </p>
            <div className="flex items-center gap-0.5 text-[10px]">
              <span className="font-medium text-green-600 tabular-nums dark:text-green-400">
                {fighter.wins}
              </span>
              <span className="text-muted-foreground">-</span>
              <span className="font-medium text-red-600 tabular-nums dark:text-red-400">
                {fighter.losses}
              </span>
              {fighter.draws > 0 && (
                <Fragment>
                  <span className="text-muted-foreground">-</span>
                  <span className="text-neutral-600 tabular-nums dark:text-neutral-400">
                    {fighter.draws}
                  </span>
                </Fragment>
              )}
            </div>
          </div>
        </div>
      </PrefetchLink>
    </li>
  );
});

export function P4PSidebarClient({
  maleP4PRankings,
  femaleP4PRankings,
}: P4PSidebarProps) {
  return (
    <Card className="p-0">
      <Tabs defaultValue="male" className="h-full flex flex-col">
        <TabsList className="w-full bg-transparent border-b shadow-sm">
          <TabsTrigger
            value="male"
            className="data-[state=inactive]:bg-background/50 data-[state=inactive]:shadow-xs"
          >
            Male
          </TabsTrigger>
          <TabsTrigger
            value="female"
            className="data-[state=inactive]:bg-background/50 data-[state=inactive]:shadow-xs"
          >
            Female
          </TabsTrigger>
        </TabsList>

        <CardTitle className="text-center p-4 border-b">
          Pound For Pound Rankings
        </CardTitle>

        <CardContent className="p-4 flex-1 overflow-y-auto">
          <TabsContent value="male" className="h-full">
            <ul className="space-y-3">
              {maleP4PRankings.map((fighter, index) => (
                <FighterCard
                  key={fighter.id}
                  fighter={fighter}
                  isPriority={index < 15}
                />
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="female" className="h-full">
            <ul className="space-y-3">
              {femaleP4PRankings.map((fighter, index) => (
                <FighterCard
                  key={fighter.id}
                  fighter={fighter}
                  isPriority={index < 15}
                />
              ))}
            </ul>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
