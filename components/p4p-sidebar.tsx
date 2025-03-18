"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

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
    <div className="flex-grow">
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
  const [currentGender, setCurrentGender] = useState<"male" | "female">("male");
  const rankings =
    currentGender === "male" ? maleP4PRankings : femaleP4PRankings;

  return (
    <Card
      className={cn(
        "h-full flex flex-col",
        "border-red-600/10 dark:border-red-600/10",
        "bg-white dark:bg-neutral-950",
        "shadow-sm hover:shadow-md",
        "transition-all duration-200",
        "hover:border-red-600/20 dark:hover:border-red-600/20",
        "relative overflow-hidden group"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/0 to-red-600/0 group-hover:from-red-600/[0.02] group-hover:to-red-600/[0.03] transition-all duration-200" />
      
      <CardHeader className="p-2 pb-0 shrink-0 relative z-10">
        <div className="flex items-center justify-center mb-2">
          <h1 className="text-sm">
            Pound for Pound Rankings
          </h1>
        </div>
        <CardTitle className="text-xs">
          <Tabs
            defaultValue="male"
            onValueChange={(value) =>
              setCurrentGender(value as "male" | "female")
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 bg-red-700/10 dark:bg-red-700/20">
              <TabsTrigger
                value="male"
                className="data-[state=active]:bg-red-600/20 dark:data-[state=active]"
              >
                Male
              </TabsTrigger>
              <TabsTrigger
                value="female"
                className="data-[state=active]:bg-red-600/20 dark:data-[state=active]"
              >
                Female
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 flex-1 flex flex-col relative z-10">
        <div className="h-full flex flex-col justify-between">
          {rankings.map((fighter) => (
            <FighterCard key={fighter.id} fighter={fighter} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
