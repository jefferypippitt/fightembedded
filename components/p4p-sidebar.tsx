"use client";

import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AthleteAvatar } from "@/components/ui/athlete-avatar";
import { getCountryCode } from "@/lib/country-codes";
import { Badge } from "@/components/ui/badge";

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

const FighterCard = React.memo(({ fighter }: { fighter: Fighter }) => (
  <li className="flex items-center space-x-1 p-2 hover:bg-accent/50 rounded-md transition-colors">
    <Badge variant="outline" className="h-5 px-2 text-xs font-medium">
      {fighter.poundForPoundRank}.
    </Badge>
    <AthleteAvatar
      imageUrl={fighter.imageUrl}
      countryCode={getCountryCode(fighter.country)}
      size="xs"
    />
    <div>
      <p className="text-sm">{fighter.name}</p>
      <div className="flex items-center">
        <Badge
          variant="outline"
          className="h-5 px-2 text-xs font-normal bg-background border"
        >
          <span className="text-green-500 font-medium">{fighter.wins}</span>
          <span className="text-muted-foreground mx-0.5">-</span>
          <span className="text-red-500 font-medium">{fighter.losses}</span>
          {fighter.draws > 0 && (
            <>
              <span className="text-muted-foreground mx-0.5">-</span>
              <span className="text-yellow-500 font-medium">
                {fighter.draws}
              </span>
            </>
          )}
        </Badge>
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
    <Card className="p-0">
      <Tabs defaultValue="male">
        <TabsList className="w-full">
          <TabsTrigger
            value="male"
            className="px-3 py-1 text-sm data-[state=active]:bg-red-100 dark:data-[state=active]:bg-red-950 data-[state=active]:text-red-700 dark:data-[state=active]:text-red-300 data-[state=active]:shadow-sm transition-all duration-200"
          >
            Male
          </TabsTrigger>
          <TabsTrigger
            value="female"
            className="px-3 py-1 text-sm data-[state=active]:bg-red-100 dark:data-[state=active]:bg-red-950 data-[state=active]:text-red-700 dark:data-[state=active]:text-red-300 data-[state=active]:shadow-sm transition-all duration-200"
          >
            Female
          </TabsTrigger>
        </TabsList>

        <CardTitle className="text-center text-sm font-medium py-2 border-b">
          Pound For Pound Rankings
        </CardTitle>

        <CardContent className="p-2">
          <TabsContent value="male">
            <ul className="space-y-2.5">
              {maleP4PRankings.map((fighter) => (
                <FighterCard key={fighter.id} fighter={fighter} />
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="female">
            <ul className="space-y-2.5">
              {femaleP4PRankings.map((fighter) => (
                <FighterCard key={fighter.id} fighter={fighter} />
              ))}
            </ul>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
