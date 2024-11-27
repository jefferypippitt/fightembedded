"use client";

import { useEffect, useState } from "react";
import { getP4PRankings } from "@/server/actions/get-p4p";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

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

const RankingSkeleton = () => (
  <div className="space-y-1">
    {[...Array(15)].map((_, i) => (
      <div key={i} className="flex items-center space-x-2 p-1.5">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-9 w-9 rounded-full" />
        <div className="flex-grow">
          <Skeleton className="h-3 w-16 mb-1" />
          <Skeleton className="h-2 w-12" />
        </div>
      </div>
    ))}
  </div>
)

const FighterCard = ({ fighter }: { fighter: Fighter }) => (
  <li className="flex items-center space-x-2 p-1.5 hover:bg-accent rounded-md transition-colors">
    <span className="font-bold text-sm w-4">
      {fighter.poundForPoundRank}.
    </span>
    <Avatar className="h-9 w-9 rounded-full">
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
      <div className="flex items-center gap-1">
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
)

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast({
          title: "Error loading rankings",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, [showFemale]);

  return (
    <Card className="h-full">
      <CardHeader className="p-2">
        <CardTitle className="text-xs flex items-center justify-between">
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
      <CardContent className="p-2">
        <ScrollArea className="h-[calc(100vh-280px)]">
          {loading ? (
            <RankingSkeleton />
          ) : (
            <div className="flex flex-col gap-1">
              <div className="grid grid-cols-1 gap-2 w-full">
                {rankings.map((fighter) => (
                  <div key={fighter.id} className="w-full">
                    <FighterCard fighter={fighter} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
