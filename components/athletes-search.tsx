"use client";

import { useCallback, useMemo, memo, Suspense } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { AthleteListCard } from "@/components/athlete-list-card";
import { AthleteComparisonChart } from "@/components/athlete-comparison-chart";
import type { Athlete } from "@/types/athlete";
import { useQueryState, parseAsArrayOf, parseAsString } from "nuqs";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

interface AthletesSearchProps {
  athletes: Athlete[];
  placeholder?: string;
  title?: string;
  weight?: number;
}

// Selected athlete button component
const SelectedAthleteButton = memo(
  ({ athlete, onRemove }: { athlete: Athlete; onRemove: () => void }) => (
    <Button
      variant="outline"
      size="sm"
      onClick={onRemove}
      className="flex items-center gap-2"
    >
      <span className="truncate max-w-32">{athlete.name}</span>
      <X className="h-3 w-3 flex-shrink-0" />
    </Button>
  )
);

SelectedAthleteButton.displayName = "SelectedAthleteButton";

// Athletes grid component
const AthletesGrid = memo(
  ({
    athletes,
    selectedAthletes,
    onSelect,
    searchInput,
  }: {
    athletes: Athlete[];
    selectedAthletes: Athlete[];
    onSelect: (athlete: Athlete) => void;
    searchInput: string;
  }) => {
    // Sort athletes by rank first, then by name for same rank
    const sortedAthletes = useMemo(() => {
      return [...athletes].sort((a, b) => {
        // Handle unranked athletes (rank 0 or undefined)
        const aRank = a.rank && a.rank > 0 ? a.rank : Infinity;
        const bRank = b.rank && b.rank > 0 ? b.rank : Infinity;

        // If both have valid ranks, sort by rank
        if (aRank !== Infinity && bRank !== Infinity) {
          return aRank - bRank;
        }

        // If only one has a valid rank, put the ranked one first
        if (aRank !== Infinity && bRank === Infinity) {
          return -1;
        }
        if (aRank === Infinity && bRank !== Infinity) {
          return 1;
        }

        // If neither has a valid rank, sort by name
        return a.name.localeCompare(b.name);
      });
    }, [athletes]);

    const filteredAthletes = useMemo(() => {
      if (!searchInput.trim()) return sortedAthletes;

      const searchTerms = searchInput.toLowerCase().trim().split(/\s+/);
      return sortedAthletes.filter((athlete: Athlete) => {
        const athleteText = [
          athlete.name || "",
          athlete.country || "",
          athlete.weightDivision || "",
        ]
          .join(" ")
          .toLowerCase();

        return searchTerms.every((term) => athleteText.includes(term));
      });
    }, [sortedAthletes, searchInput]);

    return (
      <div className="space-y-6">
        {/* Athletes content */}
        {selectedAthletes.length === 2 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {selectedAthletes.map((athlete) => (
              <div key={athlete.id} className="*:data-[slot=card]:shadow-xs">
                <AthleteListCard
                  {...athlete}
                  imageUrl={athlete.imageUrl || undefined}
                  draws={athlete.draws ?? undefined}
                  rank={athlete.rank ?? undefined}
                  poundForPoundRank={athlete.poundForPoundRank ?? undefined}
                  retired={athlete.retired ?? false}
                  isSelected={true}
                  onSelect={() => onSelect(athlete)}
                  priority={true}
                />
              </div>
            ))}
            <div className=" *:data-[slot=card]:shadow-xs">
              <AthleteComparisonChart
                athlete1={selectedAthletes[0]}
                athlete2={selectedAthletes[1]}
              />
            </div>
          </div>
        ) : selectedAthletes.length === 1 ? (
          <>
            {/* Show the selected athlete prominently */}
            <div className="mb-6">
              <div className="text-xs text-muted-foreground mb-3">
                Selected athlete:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                <div className=" *:data-[slot=card]:shadow-xs">
                  <AthleteListCard
                    {...selectedAthletes[0]}
                    imageUrl={selectedAthletes[0].imageUrl || undefined}
                    draws={selectedAthletes[0].draws ?? undefined}
                    rank={selectedAthletes[0].rank ?? undefined}
                    poundForPoundRank={
                      selectedAthletes[0].poundForPoundRank ?? undefined
                    }
                    retired={selectedAthletes[0].retired ?? false}
                    isSelected={true}
                    onSelect={() => onSelect(selectedAthletes[0])}
                    priority={true}
                  />
                </div>
              </div>
            </div>

            {/* Show search results if there's a search query */}
            {searchInput.trim() && (
              <div>
                <div className="text-xs text-muted-foreground mb-2">
                  Search results (select another athlete for comparison)
                </div>
                <AthletesList
                  athletes={filteredAthletes.filter(
                    (athlete) => athlete.id !== selectedAthletes[0].id
                  )}
                  selectedAthletes={selectedAthletes}
                  onSelect={onSelect}
                />
              </div>
            )}

            {/* Show all other athletes if no search query */}
            {!searchInput.trim() && (
              <div>
                <div className="text-xs text-muted-foreground mb-2">
                  Select another athlete for comparison:
                </div>
                <AthletesList
                  athletes={sortedAthletes.filter(
                    (athlete) => athlete.id !== selectedAthletes[0].id
                  )}
                  selectedAthletes={selectedAthletes}
                  onSelect={onSelect}
                />
              </div>
            )}
          </>
        ) : searchInput.trim() ? (
          <>
            {/* Get athletes that match the search but aren't already selected */}
            {(() => {
              const searchResults = filteredAthletes.filter(
                (athlete) =>
                  !selectedAthletes.some(
                    (selected) => selected.id === athlete.id
                  )
              );

              return (
                <>
                  <div className="text-xs text-muted-foreground mb-3 sm:mb-4 text-center">
                    {searchResults.length === 0 && selectedAthletes.length === 0
                      ? "No results found"
                      : `Showing ${
                          searchResults.length + selectedAthletes.length
                        } of ${athletes.length} athletes`}
                  </div>

                  {/* Show search results */}
                  {searchResults.length > 0 && (
                    <div>
                      <div className="text-xs text-muted-foreground mb-2">
                        Search results:
                      </div>
                      <AthletesList
                        athletes={searchResults}
                        selectedAthletes={selectedAthletes}
                        onSelect={onSelect}
                      />
                    </div>
                  )}
                </>
              );
            })()}
          </>
        ) : (
          /* Show all athletes when no search query */
          <AthletesList
            athletes={sortedAthletes}
            selectedAthletes={selectedAthletes}
            onSelect={onSelect}
          />
        )}
      </div>
    );
  }
);

AthletesGrid.displayName = "AthletesGrid";

// Athletes list component
const AthletesList = memo(
  ({
    athletes,
    selectedAthletes,
    onSelect,
  }: {
    athletes: Athlete[];
    selectedAthletes: Athlete[];
    onSelect: (athlete: Athlete) => void;
  }) => {
    return (
      <div
        className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs"
        role="grid"
        aria-label="Athletes grid"
      >
        {athletes.map((athlete, index) => (
          <AthleteListCard
            key={athlete.id}
            {...athlete}
            imageUrl={athlete.imageUrl || undefined}
            draws={athlete.draws ?? undefined}
            rank={athlete.rank ?? undefined}
            poundForPoundRank={athlete.poundForPoundRank ?? undefined}
            retired={athlete.retired ?? false}
            isSelected={selectedAthletes.some((a) => a.id === athlete.id)}
            onSelect={() => onSelect(athlete)}
            priority={index < 10}
          />
        ))}
      </div>
    );
  }
);

AthletesList.displayName = "AthletesList";

// Client component that handles search state
function AthletesSearchClient({
  athletes,
  placeholder,
  title,
  weight,
}: AthletesSearchProps) {
  const [searchQuery, setSearchQuery] = useQueryState(
    "q",
    parseAsString
      .withDefault("")
      .withOptions({ shallow: true, clearOnDefault: true, history: "replace" })
  );
  const [selectedNames, setSelectedNames] = useQueryState(
    "sel",
    parseAsArrayOf(parseAsString)
      .withDefault([])
      .withOptions({ shallow: true, clearOnDefault: true, history: "replace" })
  );

  const selectedAthletes = useMemo(
    () =>
      selectedNames
        .map((name) => athletes.find((a) => a.name === name))
        .filter((a): a is Athlete => Boolean(a))
        .slice(0, 2),
    [selectedNames, athletes]
  );

  const selectionLimitReached = selectedAthletes.length >= 2;

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value);
    },
    [setSearchQuery]
  );

  const handleSelect = useCallback(
    (athlete: Athlete) => {
      setSelectedNames((prev) => {
        const alreadySelected = prev.includes(athlete.name);
        if (alreadySelected) {
          return prev.filter((name) => name !== athlete.name);
        }
        const next =
          prev.length < 2 ? [...prev, athlete.name] : [prev[1], athlete.name];

        if (next.length === 2) {
          setSearchQuery("");
        }
        return next;
      });
    },
    [setSelectedNames, setSearchQuery]
  );

  const handleRemoveAthlete = useCallback(
    (athlete: Athlete) => {
      setSelectedNames((prev) => prev.filter((name) => name !== athlete.name));
    },
    [setSelectedNames]
  );

  return (
    <div className="space-y-6">
      {/* Header with title and search input */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white tracking-tight">
              {title || "All UFC Athletes"}
            </h1>
            {weight && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-medium bg-transparent border border-muted-foreground/20 text-muted-foreground">
                {weight} lbs
              </span>
            )}
          </div>
          <div className="w-full sm:w-80 lg:w-96">
            <InputGroup>
              <InputGroupInput
                type="text"
                placeholder={placeholder ?? ""}
                value={searchQuery ?? ""}
                onChange={(e) => handleSearchChange(e.target.value)}
                disabled={selectionLimitReached}
                className="text-base sm:text-base placeholder:text-sm"
              />
              <InputGroupAddon>
                <Search className="h-4 w-4" />
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>

        {/* Selected athletes display - under title */}
        {selectedAthletes.length > 0 && (
          <div className="flex justify-start">
            <ButtonGroup>
              <ButtonGroup>
                {selectedAthletes.map((athlete) => (
                  <SelectedAthleteButton
                    key={athlete.id}
                    athlete={athlete}
                    onRemove={() => handleRemoveAthlete(athlete)}
                  />
                ))}
              </ButtonGroup>
              <ButtonGroup>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => selectedAthletes.forEach(handleRemoveAthlete)}
                >
                  Clear All
                </Button>
              </ButtonGroup>
            </ButtonGroup>
          </div>
        )}
      </div>

      <AthletesGrid
        athletes={athletes}
        selectedAthletes={selectedAthletes}
        onSelect={handleSelect}
        searchInput={searchQuery ?? ""}
      />
    </div>
  );
}

// Main search container - Server Component
export function AthletesSearchContainer({
  athletes,
  placeholder = "Search athletes by name, country, or division...",
  title,
  weight,
}: AthletesSearchProps) {
  return (
    <Suspense
      fallback={
        <div className="text-center py-4">
          <div className="text-sm text-muted-foreground">Loading search...</div>
        </div>
      }
    >
      <AthletesSearchClient
        athletes={athletes}
        placeholder={placeholder}
        title={title}
        weight={weight}
      />
    </Suspense>
  );
}

// Main export
export function AthletesSearch(props: AthletesSearchProps) {
  return <AthletesSearchContainer {...props} />;
}
