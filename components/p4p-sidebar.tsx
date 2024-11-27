"use client";

import { useEffect, useState } from "react";
import { getP4PRankings } from "@/server/actions/get-p4p";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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

export function P4PSidebar() {
  const [showFemale, setShowFemale] = useState(false);
  const [rankings, setRankings] = useState<Fighter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true);
      try {
        const { maleP4PRankings, femaleP4PRankings } = await getP4PRankings();
        const rankings = (showFemale ? femaleP4PRankings : maleP4PRankings).map(
          (fighter) => ({
            id: fighter.id,
            name: fighter.name,
            imageUrl: fighter.imageUrl || "/images/default-avatar.png",
            weightDivision: fighter.weightDivision,
            poundForPoundRank: fighter.poundForPoundRank,
            wins: fighter.wins,
            losses: fighter.losses,
            draws: fighter.draws,
          })
        );
        setRankings(rankings);
      } catch (error) {
        console.error("Error fetching rankings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, [showFemale]);

  return (
    <Card className="w-full h-full">
      <CardHeader className="p-3">
        <CardTitle className="text-sm flex items-center justify-between">
          <span>P4P Rankings</span>
          <div className="flex space-x-1">
            <Button
              variant={showFemale ? "outline" : "default"}
              size="sm"
              className="text-xs px-2 py-1 h-auto"
              onClick={() => setShowFemale(false)}
            >
              Male
            </Button>
            <Button
              variant={showFemale ? "default" : "outline"}
              size="sm"
              className="text-xs px-2 py-1 h-auto"
              onClick={() => setShowFemale(true)}
            >
              Female
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <ScrollArea className="h-[calc(100vh-200px)]">
          {loading ? (
            <div className="space-y-2">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse flex items-center space-x-2"
                >
                  <div className="w-4 h-4 bg-gray-200 rounded" />
                  <div className="h-10 w-10 bg-gray-200 rounded-full" />
                  <div className="flex-grow">
                    <div className="h-3 bg-gray-200 rounded w-20 mb-1" />
                    <div className="h-3 bg-gray-200 rounded w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ul className="space-y-2">
              {rankings.map((fighter) => (
                <li
                  key={fighter.id}
                  className="flex items-center space-x-2 p-1.5 hover:bg-accent rounded-md transition-colors"
                >
                  <span className="font-bold text-sm w-4">
                    {fighter.poundForPoundRank}.
                  </span>
                  <Avatar className="h-10 w-10 rounded-full">
                    <AvatarImage
                      src={fighter.imageUrl || "/images/default-avatar.png"}
                      alt={fighter.name}
                      className="object-cover aspect-square"
                    />
                    <AvatarFallback className="text-sm">
                      {fighter.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <p className="font-medium text-sm leading-tight">
                      {fighter.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">
                        {fighter.weightDivision}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {fighter.wins}-{fighter.losses}
                        {fighter.draws > 0 ? `-${fighter.draws}` : ""}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
