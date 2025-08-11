"use client";

import { useCallback, useMemo, memo, Suspense } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AthleteListCard } from "@/components/athlete-list-card";
import { AthleteComparisonChart } from "@/components/athlete-comparison-chart";
import type { Athlete } from "@/types/athlete";
import { useQueryState, parseAsArrayOf, parseAsString } from "nuqs";

interface AthletesSearchProps {
  athletes: Athlete[];
  placeholder?: string;
}

// Selected athlete badge component
const SelectedAthleteBadge = memo(
  ({ athlete, onRemove }: { athlete: Athlete; onRemove: () => void }) => (
    <Badge variant="secondary" className="flex items-center gap-1">
      <span className="truncate sm:text-clip sm:whitespace-normal text-xs sm:text-sm">
        {athlete.name}
      </span>
      <Button
        variant="ghost"
        size="icon"
        type="button"
        onClick={onRemove}
        className="h-3.5 w-3.5 cursor-pointer"
        aria-label={`Remove ${athlete.name}`}
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </Badge>
  )
);

SelectedAthleteBadge.displayName = "SelectedAthleteBadge";

// Search input component
const SearchInput = memo(
  ({
    searchInput,
    onSearchChange,
    selectedAthletes,
    onRemoveAthlete,
    selectionLimitReached,
    placeholder,
  }: {
    searchInput: string;
    onSearchChange: (value: string) => void;
    selectedAthletes: Athlete[];
    onRemoveAthlete: (athlete: Athlete) => void;
    selectionLimitReached: boolean;
    placeholder: string;
  }) => (
    <div className="relative">
      <div className="flex items-center min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
        {/* Search icon */}
        <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />

        {/* Selected athlete badges */}
        {selectedAthletes.length > 0 && (
          <div className="flex items-center gap-2 ml-2 flex-wrap">
            {selectedAthletes.map((athlete) => (
              <SelectedAthleteBadge
                key={athlete.id}
                athlete={athlete}
                onRemove={() => onRemoveAthlete(athlete)}
              />
            ))}
          </div>
        )}

        {/* Text input */}
        <input
          type="text"
          placeholder={selectedAthletes.length > 0 ? "" : placeholder}
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          autoComplete="off"
          disabled={selectionLimitReached}
          className="flex-1 min-w-0 bg-transparent border-none outline-none placeholder:text-muted-foreground text-sm ml-2"
        />

        {/* Right-side actions */}
        <SearchActions
          searchInput={searchInput}
          selectedAthletes={selectedAthletes}
          onClearAll={() => selectedAthletes.forEach(onRemoveAthlete)}
          onClearSearch={() => onSearchChange("")}
        />
      </div>
    </div>
  )
);

SearchInput.displayName = "SearchInput";

// Search actions component
const SearchActions = memo(
  ({
    searchInput,
    selectedAthletes,
    onClearAll,
    onClearSearch,
  }: {
    searchInput: string;
    selectedAthletes: Athlete[];
    onClearAll: () => void;
    onClearSearch: () => void;
  }) => {
    if (!searchInput && selectedAthletes.length === 0) return null;

    return (
      <div className="flex items-center gap-1 ml-2 flex-shrink-0">
        {selectedAthletes.length > 0 ? (
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={onClearAll}
            className="h-7 w-7 cursor-pointer"
            title="Clear all selections"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={onClearSearch}
            className="h-7 w-7 cursor-pointer"
            title="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    );
  }
);

SearchActions.displayName = "SearchActions";

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
    const filteredAthletes = useMemo(() => {
      if (!searchInput.trim()) return athletes;

      const searchTerms = searchInput.toLowerCase().trim().split(/\s+/);
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
    }, [athletes, searchInput]);

    // Show selected athletes comparison when exactly 2 are selected
    if (selectedAthletes.length === 2) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {selectedAthletes.map((athlete) => (
            <div
              key={athlete.id}
              className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs"
            >
              <AthleteListCard
                {...athlete}
                imageUrl={athlete.imageUrl || undefined}
                retired={athlete.retired ?? false}
                isSelected={true}
                onSelect={() => onSelect(athlete)}
                priority={true}
              />
            </div>
          ))}
          <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
            <AthleteComparisonChart
              athlete1={selectedAthletes[0]}
              athlete2={selectedAthletes[1]}
            />
          </div>
        </div>
      );
    }

    // Show selected athletes when there's 1 selected (for sharing single athlete URLs)
    if (selectedAthletes.length === 1) {
      return (
        <>
          {/* Show the selected athlete prominently */}
          <div className="mb-6">
            <div className="text-sm sm:text-base text-muted-foreground mb-3">
              Selected athlete:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
                <AthleteListCard
                  {...selectedAthletes[0]}
                  imageUrl={selectedAthletes[0].imageUrl || undefined}
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
              <div className="text-xs sm:text-sm text-muted-foreground mb-2">
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
              <div className="text-xs sm:text-sm text-muted-foreground mb-2">
                Select another athlete for comparison:
              </div>
              <AthletesList
                athletes={athletes.filter(
                  (athlete) => athlete.id !== selectedAthletes[0].id
                )}
                selectedAthletes={selectedAthletes}
                onSelect={onSelect}
              />
            </div>
          )}
        </>
      );
    }

    // Show search results with selected athletes always visible
    if (searchInput.trim()) {
      // Get athletes that match the search but aren't already selected
      const searchResults = filteredAthletes.filter(
        (athlete) =>
          !selectedAthletes.some((selected) => selected.id === athlete.id)
      );

      return (
        <>
          <div className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 text-center">
            {searchResults.length === 0 && selectedAthletes.length === 0
              ? "No results found"
              : `Showing ${searchResults.length + selectedAthletes.length} of ${
                  athletes.length
                } athletes`}
          </div>

          {/* Show selected athletes first if any */}
          {selectedAthletes.length > 0 && (
            <div className="mb-4">
              <div className="text-xs sm:text-sm text-muted-foreground mb-2">
                Selected athletes:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {selectedAthletes.map((athlete) => (
                  <div
                    key={athlete.id}
                    className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs"
                  >
                    <AthleteListCard
                      {...athlete}
                      imageUrl={athlete.imageUrl || undefined}
                      retired={athlete.retired ?? false}
                      isSelected={true}
                      onSelect={() => onSelect(athlete)}
                      priority={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Show search results */}
          {searchResults.length > 0 && (
            <div>
              <div className="text-xs sm:text-sm text-muted-foreground mb-2">
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
    }

    // Show all athletes when no search query
    return (
      <AthletesList
        athletes={athletes}
        selectedAthletes={selectedAthletes}
        onSelect={onSelect}
      />
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
function AthletesSearchClient({ athletes, placeholder }: AthletesSearchProps) {
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
    <div>
      <div className="mb-3 sm:mb-4 lg:mb-6">
        <SearchInput
          searchInput={searchQuery ?? ""}
          onSearchChange={handleSearchChange}
          selectedAthletes={selectedAthletes}
          onRemoveAthlete={handleRemoveAthlete}
          selectionLimitReached={selectionLimitReached}
          placeholder={placeholder ?? ""}
        />
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
}: AthletesSearchProps) {
  return (
    <Suspense
      fallback={
        <div className="text-center py-4">
          <div className="text-sm text-muted-foreground">Loading search...</div>
        </div>
      }
    >
      <AthletesSearchClient athletes={athletes} placeholder={placeholder} />
    </Suspense>
  );
}

// Main export
export function AthletesSearch(props: AthletesSearchProps) {
  return <AthletesSearchContainer {...props} />;
}
