"use client";

import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AthleteAvatar } from "@/components/ui/athlete-avatar";
import { getCountryCode } from "@/lib/country-codes";

interface Fighter {
  id: string;
  name: string;
  imageUrl: string;
  poundForPoundRank: number;
  wins: number;
  losses: number;
  draws: number;
  country: string;
}

interface P4PSidebarProps {
  maleP4PRankings: Fighter[];
  femaleP4PRankings: Fighter[];
}

const FighterCard = React.memo(
  ({
    fighter,
    isPriority = false,
  }: {
    fighter: Fighter;
    isPriority?: boolean;
  }) => (
    <li className="flex items-center space-x-2 p-2 hover:bg-accent/50 transition-colors border h-16">
      <span className="px-2.5 text-xs font-medium min-w-[2rem]">
        {fighter.poundForPoundRank}.
      </span>
      <AthleteAvatar
        imageUrl={fighter.imageUrl}
        countryCode={getCountryCode(fighter.country)}
        size="xs"
        priority={isPriority}
      />
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <p className="text-xs font-medium leading-tight">{fighter.name}</p>
        <div className="text-[10px] text-muted-foreground">
          <span className="text-green-500">{fighter.wins}</span>
          <span>-</span>
          <span className="text-red-500">{fighter.losses}</span>
          {fighter.draws > 0 && (
            <>
              <span>-</span>
              <span className="text-amber-500">{fighter.draws}</span>
            </>
          )}
        </div>
      </div>
    </li>
  )
);

FighterCard.displayName = "FighterCard";

export function P4PSidebarClient({
  maleP4PRankings,
  femaleP4PRankings,
}: P4PSidebarProps) {
  return (
    <Card className="p-0">
      <Tabs defaultValue="male">
        <TabsList className="w-full">
          <TabsTrigger value="male">Male</TabsTrigger>
          <TabsTrigger value="female">Female</TabsTrigger>
        </TabsList>

        <CardTitle className=" text-center p-4 border-b font-mono">
          Pound For Pound Rankings
        </CardTitle>

        <CardContent className="p-4">
          <TabsContent value="male">
            <ul className="space-y-2">
              {maleP4PRankings.map((fighter, index) => (
                <FighterCard
                  key={fighter.id}
                  fighter={fighter}
                  isPriority={index < 3}
                />
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="female">
            <ul className="space-y-2">
              {femaleP4PRankings.map((fighter, index) => (
                <FighterCard
                  key={fighter.id}
                  fighter={fighter}
                  isPriority={index < 3}
                />
              ))}
            </ul>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
