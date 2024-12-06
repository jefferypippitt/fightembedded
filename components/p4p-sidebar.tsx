"use client";

import React, { useEffect, useState } from "react";
import { getP4PRankings } from "@/server/actions/get-p4p";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    className="space-y-1"
  >
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
  </motion.div>
);

const FighterCard = React.memo(({ fighter }: { fighter: Fighter }) => (
  <motion.li
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="flex items-center space-x-2 p-1.5 hover:bg-accent rounded-md transition-colors"
  >
    <span className="font-bold text-sm w-4">{fighter.poundForPoundRank}.</span>
    <Avatar className="h-9 w-9">
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
      <p className="font-medium text-sm leading-tight">{fighter.name}</p>
      <div className="flex items-center gap-1">
        <p className="text-xs text-muted-foreground">
          {fighter.weightDivision}
        </p>
        <p className="text-xs">
          <span className="text-green-500 font-medium">{fighter.wins}</span>-
          <span className="text-red-500 font-medium">{fighter.losses}</span>
          {fighter.draws > 0 ? `-${fighter.draws}` : ""}
        </p>
      </div>
    </div>
  </motion.li>
));

FighterCard.displayName = "FighterCard";

export function P4PSidebar() {
  const [showFemale, setShowFemale] = useState(false);
  const [rankings, setRankings] = useState<Fighter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchRankings = async () => {
      setLoading(true);
      setError(null);
      try {
        const { maleP4PRankings, femaleP4PRankings } = await getP4PRankings();
        if (isMounted) {
          const rankings = (
            showFemale ? femaleP4PRankings : maleP4PRankings
          ).map((fighter) => ({
            id: fighter.id,
            name: fighter.name,
            imageUrl: fighter.imageUrl || "/images/default-avatar.png",
            weightDivision: fighter.weightDivision,
            poundForPoundRank: fighter.poundForPoundRank,
            wins: fighter.wins,
            losses: fighter.losses,
            draws: fighter.draws,
          }));
          setRankings(rankings);
        }
      } catch (error) {
        if (isMounted) {
          const errorMessage =
            error instanceof Error ? error.message : "Please try again later";
          setError(errorMessage);
          toast({
            title: "Error loading rankings",
            description: errorMessage,
            variant: "destructive",
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRankings();
    return () => {
      isMounted = false;
    };
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
              disabled={loading}
            >
              Male
            </Button>
            <Button
              variant={showFemale ? "default" : "outline"}
              size="sm"
              className="text-xs px-2 py-1 h-auto"
              onClick={() => setShowFemale(true)}
              disabled={loading}
            >
              Female
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <AnimatePresence mode="wait">
          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : loading ? (
            <RankingSkeleton />
          ) : (
            <motion.div
              key={showFemale ? "female" : "male"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-1"
            >
              {rankings.map((fighter) => (
                <FighterCard key={fighter.id} fighter={fighter} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
