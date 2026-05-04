"use client";

import { memo } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AthleteAvatar } from "@/components/ui/athlete-avatar";
import { getCountryCode } from "@/lib/country-codes";
import { Fighter, P4PSidebarProps } from "@/types/rankings";
import Link from "next/link";
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
      <Link
        href={href}
        className="group relative block h-16 overflow-hidden rounded-sm border bg-card shadow-xs transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2"
      >
        <div className="relative flex h-full items-center gap-1.5 p-2 sm:gap-2">
          <span className="px-1.5 text-xs sm:px-2.5">{fighter.poundForPoundRank}.</span>
          <AthleteAvatar
            imageUrl={fighter.imageUrl}
            updatedAt={fighter.updatedAt}
            countryCode={countryCode}
            size="xs"
            priority={isPriority}
          />
          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <p className="mb-1 text-xs font-medium text-foreground">
              {fighter.name}
            </p>
            <div className="flex items-center gap-1 text-[10px]">
              <span className="font-medium text-green-500 tabular-nums">
                {fighter.wins}
              </span>
              <span className="text-foreground">-</span>
              <span className="font-medium text-red-500 tabular-nums">
                {fighter.losses}
              </span>
              {fighter.draws > 0 && (
                <>
                  <span className="text-foreground">-</span>
                  <span className="font-medium text-foreground/80 tabular-nums">
                    {fighter.draws}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
});

export function P4PSidebarClient({
  maleP4PRankings,
  femaleP4PRankings,
}: P4PSidebarProps) {
  return (
    <Card className="min-w-0 overflow-hidden p-0">
      <Tabs defaultValue="male" className="h-full flex flex-col">
        <TabsList className="w-full bg-transparent border-b shadow-sm">
          <TabsTrigger
            value="male"
            className="text-xs sm:text-sm data-[state=inactive]:bg-background/50 data-[state=inactive]:shadow-xs"
          >
            Male
          </TabsTrigger>
          <TabsTrigger
            value="female"
            className="text-xs sm:text-sm data-[state=inactive]:bg-background/50 data-[state=inactive]:shadow-xs"
          >
            Female
          </TabsTrigger>
        </TabsList>

        <CardTitle className="border-b p-3 text-center text-lg sm:p-4 sm:text-xl tracking-tighter">
          Pound For Pound Rankings
        </CardTitle>

        <CardContent className="flex-1 overflow-y-auto p-2 sm:p-4">
          <TabsContent value="male" className="h-full">
            <ul className="space-y-2 sm:space-y-3">
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
            <ul className="space-y-2 sm:space-y-3">
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
