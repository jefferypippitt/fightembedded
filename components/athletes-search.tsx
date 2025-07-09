"use client";

import { useState, useCallback, useMemo } from "react";
import { useDebouncedCallback } from "use-debounce";
import { SearchBar } from "@/components/search-bar";
import { AthleteComparison } from "@/components/athlete-comparison";
import { AthleteListCard } from "@/components/athlete-list-card";
import type { Athlete } from "@/types/athlete";

interface AthletesSearchProps {
  athletes: Athlete[];
  placeholder?: string;
  showEmptyMessage?: boolean;
  emptyMessage?: string;
}

function Athletes({
  athletes,
  selectedAthletes,
  onSelect,
  showEmptyMessage = true,
  emptyMessage = "No athletes found matching your search.",
}: {
  athletes: Athlete[];
  selectedAthletes: Athlete[];
  onSelect: (athlete: Athlete) => void;
  showEmptyMessage?: boolean;
  emptyMessage?: string;
}) {
  if (athletes.length === 0 && showEmptyMessage) {
    return (
      <div className="text-center space-y-2">
        <p className="text-muted-foreground">{emptyMessage}</p>
        <p className="text-sm text-muted-foreground">
          Try adjusting your search terms or check for typos.
        </p>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
      role="grid"
      aria-label="Athletes grid"
    >
      {athletes.map((athlete) => (
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
        />
      ))}
    </div>
  );
}

export function AthletesSearch({
  athletes,
  placeholder = "Search athletes by name, country, or division...",
  showEmptyMessage = true,
  emptyMessage = "No athletes found matching your search.",
}: AthletesSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAthletes, setSelectedAthletes] = useState<Athlete[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Memoized filtered athletes
  const filteredAthletes = useMemo(() => {
    if (!searchQuery.trim()) return athletes;

    const searchTerms = searchQuery.toLowerCase().trim().split(/\s+/);

    return athletes.filter((athlete) =>
      searchTerms.every(
        (term) =>
          athlete.name.toLowerCase().includes(term) ||
          athlete.country.toLowerCase().includes(term) ||
          athlete.weightDivision.toLowerCase().includes(term)
      )
    );
  }, [athletes, searchQuery]);

  // Debounced search handler
  const handleSearch = useDebouncedCallback((value: string) => {
    setIsSearching(true);
    setSearchQuery(value);
    setIsSearching(false);
  }, 300);

  // Memoized athlete selection handler
  const handleAthleteSelect = useCallback((athlete: Athlete) => {
    setSelectedAthletes((prev) => {
      const isSelected = prev.some((a) => a.id === athlete.id);
      if (isSelected) return prev.filter((a) => a.id !== athlete.id);
      if (prev.length >= 2) return [prev[1], athlete];
      return [...prev, athlete];
    });
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="w-full sm:w-[400px]">
          <SearchBar
            onChange={handleSearch}
            placeholder={placeholder}
            aria-label="Search athletes"
            maxWidth="400px"
            isLoading={isSearching}
          />
        </div>
        <div className="shrink-0">
          <AthleteComparison
            selectedAthletes={selectedAthletes}
            onClearSelection={() => setSelectedAthletes([])}
          />
        </div>
      </div>

      <Athletes
        athletes={filteredAthletes}
        selectedAthletes={selectedAthletes}
        onSelect={handleAthleteSelect}
        showEmptyMessage={showEmptyMessage}
        emptyMessage={emptyMessage}
      />
    </div>
  );
}
