"use client";

import React, { useEffect, useState } from "react";
import { getP4PRankings } from "@/server/actions/get-p4p";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

const FighterCard = React.memo(({ fighter }: { fighter: Fighter }) => (
  <motion.li
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="flex items-center space-x-2 p-1.5 hover:bg-red-600/10 dark:hover:bg-red-500/20 rounded-md transition-colors"
  >
    <span className="font-bold text-sm w-4 text-gray-900 dark:text-white">
      {fighter.poundForPoundRank}.
    </span>
    <Avatar className="h-10 w-10 ring-1 ring-red-600/20 dark:ring-red-500/30">
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
  </motion.li>
));

FighterCard.displayName = "FighterCard";

export function P4PSidebar() {
  const [rankings, setRankings] = useState<Fighter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRankings = async (gender: "male" | "female") => {
    setLoading(true);
    setError(null);
    try {
      const { maleP4PRankings, femaleP4PRankings } = await getP4PRankings();
      const rankings = (
        gender === "female" ? femaleP4PRankings : maleP4PRankings
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
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Please try again later";
      setError(errorMessage);
      toast({
        title: "Error loading rankings",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings("male");
  }, []);

  return (
    <Card
      className={cn(
        "h-full flex flex-col",
        "border-red-600/20 dark:border-red-500/30",
        "bg-gradient-to-br from-white via-gray-50 to-gray-100",
        "dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900",
        "before:absolute before:inset-0 before:bg-gradient-to-r",
        "before:from-red-600/0 before:via-red-600/5 before:to-red-600/0",
        "dark:before:from-red-500/0 dark:before:via-red-500/20 dark:before:to-red-500/0",
        "relative overflow-hidden"
      )}
    >
      <CardHeader className="p-2 pb-0 shrink-0 relative z-10">
        <div className="flex items-center justify-center mb-2">
          <h1 className="text-sm text-gray-700 dark:text-gray-200">
            Pound for Pound Rankings
          </h1>
        </div>
        <CardTitle className="text-xs">
          <Tabs
            defaultValue="male"
            onValueChange={(value) => fetchRankings(value as "male" | "female")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 bg-red-600/10 dark:bg-red-500/20">
              <TabsTrigger
                value="male"
                disabled={loading}
                className="data-[state=active]:bg-red-600/20 dark:data-[state=active]:bg-red-500/30"
              >
                Male
              </TabsTrigger>
              <TabsTrigger
                value="female"
                disabled={loading}
                className="data-[state=active]:bg-red-600/20 dark:data-[state=active]:bg-red-500/30"
              >
                Female
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 flex-1 flex flex-col relative z-10">
        <AnimatePresence mode="wait">
          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col justify-between"
            >
              {rankings.map((fighter) => (
                <FighterCard key={fighter.id} fighter={fighter} />
              ))}
              {rankings.length < 15 && (
                <div
                  className="flex flex-col justify-between"
                  style={{
                    height: `${(15 - rankings.length) * 48}px`,
                  }}
                >
                  {[...Array(15 - rankings.length)].map((_, i) => (
                    <div
                      key={`spacer-${i}`}
                      className="h-[48px] flex items-center space-x-2 p-1.5"
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
