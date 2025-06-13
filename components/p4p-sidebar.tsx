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
  <li className="flex items-center space-x-2 p-2 hover:bg-accent/50 transition-colors border">
    <Badge variant="outline" className="h-5 px-2.5 text-xs font-medium border-2">
      {fighter.poundForPoundRank}.
    </Badge>
    <AthleteAvatar
      imageUrl={fighter.imageUrl}
      countryCode={getCountryCode(fighter.country)}
      size="xs"
      priority={fighter.poundForPoundRank <= 5}
    />
    <div>
      <p className="text-xs font-medium">{fighter.name}</p>
      <div className="flex items-center">
        <Badge
          variant="outline"
          className="h-5 px-2 text-xs font-normal bg-background border-2"
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
            className="border-solid data-[state=active]:border-b-0"
          >
            Male
          </TabsTrigger>
          <TabsTrigger
            value="female"
            className=" border-solid data-[state=active]:border-b-0"
          >
            Female
          </TabsTrigger>
        </TabsList>

        <CardTitle className="text-center text-sm p-4 border-b">
          Pound For Pound Rankings
        </CardTitle>

        <CardContent className="p-4">
          <TabsContent value="male">
            <ul className="space-y-2">
              {maleP4PRankings.map((fighter) => (
                <FighterCard key={fighter.id} fighter={fighter} />
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="female">
            <ul className="space-y-2">
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
