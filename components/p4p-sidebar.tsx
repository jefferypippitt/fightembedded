"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Fighter {
  id: string;
  name: string;
  imageUrl: string;
  weightDivision: string;
  poundForPoundRank: number;
  wins: number;
  losses: number;
  draws: number;
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
    <Avatar className="h-10 w-10 ring-1 ring-red-600/20 dark:ring-red-500/30 group-hover:ring-red-600/30 dark:group-hover:ring-red-500/40 transition-all duration-200">
      <Image
        src={fighter.imageUrl}
        alt={fighter.name}
        className="object-cover w-full h-full"
        width={100}
        height={100}
        quality={100}
        priority={true}
      />
    </Avatar>
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
    <Card className="w-full border-red-600/10 dark:border-red-600/10 bg-white dark:bg-neutral-950 shadow-xs hover:shadow-md transition-all duration-200 hover:border-red-600/20 dark:hover:border-red-600/20 relative overflow-hidden group">
      <div className="absolute inset-0 bg-linear-to-br from-red-600/0 to-red-600/0 group-hover:from-red-600/[0.02] group-hover:to-red-600/[0.03] transition-all duration-200" />
      <CardContent className="relative z-10 p-2">
        <h2 className="text-sm text-center mb-2 text-gray-900 dark:text-white">
          Pound for Pound Rankings
        </h2>
        <Tabs defaultValue="male">
          <TabsList className="grid w-full grid-cols-2 bg-red-700/10 dark:bg-red-700/20">
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
          <TabsContent value="male" className="mt-0">
            <ul className="space-y-1 -ml-1">
              {maleP4PRankings.map((fighter) => (
                <FighterCard key={fighter.id} fighter={fighter} />
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="female" className="mt-0">
            <ul className="space-y-1 -ml-1">
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
