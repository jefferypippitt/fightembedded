"use client";

import { memo } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AthleteAvatar } from "@/components/ui/athlete-avatar";
import { getCountryCode } from "@/lib/country-codes";
import { Fighter, P4PSidebarProps } from "@/types/rankings";

interface FighterCardProps {
  fighter: Fighter;
  isPriority?: boolean;
}

const FighterCard = memo(function FighterCard({
  fighter,
  isPriority = false,
}: FighterCardProps) {
  const countryCode = getCountryCode(fighter.country);

  return (
    <li className="relative overflow-hidden group transition-all duration-300 border h-16 rounded-sm shadow-xs bg-gradient-to-bl from-primary/5 to-card dark:bg-card">
      <div className="relative h-full flex items-center gap-2 p-2">
        <span className="px-2.5 text-xs">{fighter.poundForPoundRank}.</span>
        <AthleteAvatar
          imageUrl={fighter.imageUrl}
          countryCode={countryCode}
          size="xs"
          priority={isPriority}
        />
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <p className="text-xs font-medium mb-1">{fighter.name}</p>
          <div className="text-[10px] flex items-center gap-0.5">
            <span className="text-green-600 dark:text-green-400 tabular-nums font-medium">
              {fighter.wins}
            </span>
            <span className="text-muted-foreground">-</span>
            <span className="text-red-600 dark:text-red-400 tabular-nums font-medium">
              {fighter.losses}
            </span>
            {fighter.draws > 0 && (
              <>
                <span className="text-muted-foreground">-</span>
                <span className="text-neutral-600 dark:text-neutral-400 tabular-nums">
                  {fighter.draws}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
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
