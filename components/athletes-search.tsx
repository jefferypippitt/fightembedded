"use client";

import { useState, useCallback, useMemo, memo } from "react";
import { Search, X, Scale } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AthleteListCard } from "@/components/athlete-list-card";
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
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
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
          priority={index < 8}
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

  // Show selected athletes when 2 are selected, otherwise show filtered results
  const displayAthletes =
    selectedAthletes.length === 2 ? selectedAthletes : filteredAthletes;

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <div className="relative w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={placeholder}
                type="search"
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-8 pr-8 w-full [&::-webkit-search-cancel-button]:hidden placeholder:text-sm"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-transparent"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear search</span>
                </Button>
              )}
            </div>
          </div>
          <div className="flex gap-2 items-center justify-between sm:justify-end">
            {selectedAthletes.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearSelections}
                className="gap-2"
              >
                Clear
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={selectedAthletes.length === 0}
            >
              <Scale className="h-4 w-4 flex-shrink-0" />
              <span className="inline">
                <span className="hidden sm:inline">Compare </span>
                {selectedAthletes.length > 0 &&
                  `(${selectedAthletes.length}/2)`}
              </span>
            </Button>
          </div>
        </div>
      </div>

      {searchQuery && selectedAthletes.length !== 2 && (
        <div className="text-sm text-muted-foreground mb-4">
          {filteredAthletes.length === 0 ? (
            <>No results found</>
          ) : (
            <>
              Showing {filteredAthletes.length} of {athletes.length} athletes
            </>
          )}
        </div>
      )}
      <Athletes
        athletes={displayAthletes}
        selectedAthletes={selectedAthletes}
        onSelect={handleSelect}
      />
    </div>
  );
}
