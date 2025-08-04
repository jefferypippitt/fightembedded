"use client";

import { useState, useCallback, useMemo, memo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AthleteListCard } from "@/components/athlete-list-card";
import { AthleteComparisonChart } from "@/components/athlete-comparison-chart";
import type { Athlete } from "@/types/athlete";

interface AthletesSearchProps {
  athletes: Athlete[];
  placeholder?: string;
}

const Athletes = memo(function Athletes({
  athletes,
  selectedAthletes,
  onSelect,
}: {
  athletes: Athlete[];
  selectedAthletes: Athlete[];
  onSelect: (athlete: Athlete) => void;
}) {
  if (athletes.length === 0) {
    return (
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Try adjusting your search terms or check for typos.
        </p>
      </div>
    );
  }

  return (
    <div
      className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs"
      role="grid"
      aria-label="Athletes grid"
    >
      {athletes.map((athlete, index) => (
        <AthleteListCard
          key={athlete.id}
          id={athlete.id}
          name={athlete.name}
          weightDivision={athlete.weightDivision}
          imageUrl={athlete.imageUrl || undefined}
          country={athlete.country}
          wins={athlete.wins}
          losses={athlete.losses}
          draws={athlete.draws}
          winsByKo={athlete.winsByKo}
          winsBySubmission={athlete.winsBySubmission}
          rank={athlete.rank}
          poundForPoundRank={athlete.poundForPoundRank}
          followers={athlete.followers}
          age={athlete.age}
          retired={athlete.retired ?? false}
          isSelected={selectedAthletes.some((a) => a.id === athlete.id)}
          onSelect={() => onSelect(athlete)}
          priority={index < 10}
        />
      ))}
    </div>
  );
});

export function AthletesSearch({
  athletes,
  placeholder = "Search athletes by name, country, or division...",
}: AthletesSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAthletes, setSelectedAthletes] = useState<Athlete[]>([]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const handleClearSelections = useCallback(() => {
    setSelectedAthletes([]);
  }, []);

  const handleSelect = useCallback((athlete: Athlete) => {
    setSelectedAthletes((prev) => {
      const isSelected = prev.some((a) => a.id === athlete.id);
      if (isSelected) {
        // Unselect the athlete
        return prev.filter((a) => a.id !== athlete.id);
      } else if (prev.length < 2) {
        // Select the athlete if under limit
        return [...prev, athlete];
      } else {
        // Replace the last selected athlete
        return [prev[1], athlete];
      }
    });
  }, []);

  const filteredAthletes = useMemo(() => {
    if (!searchQuery.trim()) return athletes;

    const searchTerms = searchQuery.toLowerCase().trim().split(/\s+/);

    return athletes.filter((athlete) => {
      const athleteText = [
        athlete.name || "",
        athlete.country || "",
        athlete.weightDivision || "",
      ]
        .join(" ")
        .toLowerCase();

      return searchTerms.every((term) => athleteText.includes(term));
    });
  }, [athletes, searchQuery]);

  return (
    <div>
      <div className="mb-3 sm:mb-4 lg:mb-6">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center">
          <div className="flex-1 min-w-0">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={placeholder}
                type="search"
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 pr-8 w-full h-9 sm:h-10 [&::-webkit-search-cancel-button]:hidden placeholder:text-xs sm:placeholder:text-sm"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 hover:bg-muted/50"
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Clear search</span>
                </Button>
              )}
              {selectedAthletes.length > 0 && (
                <>
                  <div className="absolute right-8 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                    {selectedAthletes.length}/2
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={handleClearSelections}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 hover:bg-muted/50"
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Clear selections</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {searchQuery && selectedAthletes.length !== 2 && (
        <div className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
          {filteredAthletes.length === 0 ? (
            <>No results found</>
          ) : (
            <>
              Showing {filteredAthletes.length} of {athletes.length} athletes
            </>
          )}
        </div>
      )}

      {selectedAthletes.length === 2 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* First Athlete Card */}
          <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
            <AthleteListCard
              id={selectedAthletes[0].id}
              name={selectedAthletes[0].name}
              weightDivision={selectedAthletes[0].weightDivision}
              imageUrl={selectedAthletes[0].imageUrl || undefined}
              country={selectedAthletes[0].country}
              wins={selectedAthletes[0].wins}
              losses={selectedAthletes[0].losses}
              draws={selectedAthletes[0].draws}
              winsByKo={selectedAthletes[0].winsByKo}
              winsBySubmission={selectedAthletes[0].winsBySubmission}
              rank={selectedAthletes[0].rank}
              poundForPoundRank={selectedAthletes[0].poundForPoundRank}
              followers={selectedAthletes[0].followers}
              age={selectedAthletes[0].age}
              retired={selectedAthletes[0].retired ?? false}
              isSelected={true}
              onSelect={() => handleSelect(selectedAthletes[0])}
              priority={true}
            />
          </div>

          {/* Second Athlete Card */}
          <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
            <AthleteListCard
              id={selectedAthletes[1].id}
              name={selectedAthletes[1].name}
              weightDivision={selectedAthletes[1].weightDivision}
              imageUrl={selectedAthletes[1].imageUrl || undefined}
              country={selectedAthletes[1].country}
              wins={selectedAthletes[1].wins}
              losses={selectedAthletes[1].losses}
              draws={selectedAthletes[1].draws}
              winsByKo={selectedAthletes[1].winsByKo}
              winsBySubmission={selectedAthletes[1].winsBySubmission}
              rank={selectedAthletes[1].rank}
              poundForPoundRank={selectedAthletes[1].poundForPoundRank}
              followers={selectedAthletes[1].followers}
              age={selectedAthletes[1].age}
              retired={selectedAthletes[1].retired ?? false}
              isSelected={true}
              onSelect={() => handleSelect(selectedAthletes[1])}
              priority={true}
            />
          </div>

          {/* Radar Chart - Third column */}
          <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
            <AthleteComparisonChart
              athlete1={selectedAthletes[0]}
              athlete2={selectedAthletes[1]}
            />
          </div>
        </div>
      ) : (
        <Athletes
          athletes={filteredAthletes}
          selectedAthletes={selectedAthletes}
          onSelect={handleSelect}
        />
      )}
    </div>
  );
}
