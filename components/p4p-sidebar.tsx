"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AthleteAvatar } from "@/components/ui/athlete-avatar";
import { getCountryCode } from "@/lib/country-codes";

interface Fighter {
  id: string;
  name: string;
  imageUrl: string;
  weightDivision: string;
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

const FighterCard = React.memo(({ fighter }: { fighter: Fighter }) => (
  <li className="group relative flex items-center space-x-2 p-1.5 rounded-md transition-all duration-200 hover:bg-red-600/[0.02] dark:hover:bg-red-500/[0.03]">
    <span className="font-bold text-sm w-4 text-gray-900 dark:text-white">
      {fighter.poundForPoundRank}.
    </span>
    <AthleteAvatar
      imageUrl={fighter.imageUrl}
      countryCode={getCountryCode(fighter.country)}
      size="xs"
      className="ring-red-600/20 dark:ring-red-500/30 group-hover:ring-red-600/30 dark:group-hover:ring-red-500/40 transition-all duration-200"
    />
    <div className="grow">
      <p className="font-medium text-sm leading-tight text-gray-900 dark:text-white">
        {fighter.name}
      </p>
      <div className="flex items-center gap-1">
        <p className="text-xs text-gray-600 dark:text-gray-300">
          {fighter.weightDivision}
        </p>
        <p className="text-xs">
          <span className="text-green-500 font-medium">{fighter.wins}</span>-
          <span className="text-red-500 font-medium">{fighter.losses}</span>
          {fighter.draws > 0 ? `-${fighter.draws}` : ""}
        </p>
      </div>
    </div>
  </li>
));

FighterCard.displayName = "FighterCard";

export function P4PSidebarClient({
  maleP4PRankings,
  femaleP4PRankings,
}: P4PSidebarProps) {
  return (
    <Card className="border-red-600/10 dark:border-red-600/10 bg-white dark:bg-neutral-950 shadow-xs hover:shadow-md transition-all duration-200 hover:border-red-600/20 dark:hover:border-red-600/20 relative overflow-hidden group">
      <CardContent className="relative z-10 p-0 mx-1">
        <Tabs defaultValue="male">
          <TabsList className="w-full bg-red-700/10 dark:bg-red-700/20">
            <TabsTrigger 
              value="male"
              className="data-[state=active]:bg-red-500/20 dark:data-[state=active]:bg-red-600/20"
            >
              Male
            </TabsTrigger>
            <TabsTrigger 
              value="female"
              className="data-[state=active]:bg-red-500/20 dark:data-[state=active]:bg-red-600/20"
            >
              Female
            </TabsTrigger>
          </TabsList>
          <TabsContent value="male">
            <ul className="space-y-1">
              {maleP4PRankings.map((fighter) => (
                <FighterCard key={fighter.id} fighter={fighter} />
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="female">
            <ul className="space-y-1">
              {femaleP4PRankings.map((fighter) => (
                <FighterCard key={fighter.id} fighter={fighter} />
              ))}
            </ul>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
