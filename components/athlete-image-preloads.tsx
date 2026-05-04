import { Fragment } from "react";
import type { Athlete } from "@/types/athlete";
import type { EnrichedEvent, EventFighter } from "@/types/event";
import { getCountryCode } from "@/lib/country-codes";
import { getCachedImageUrl } from "@/lib/utils";

export function EventFighterImagePreloads({ events }: { events: EnrichedEvent[] }) {
  const fighters: EventFighter[] = [];
  for (const event of events) {
    if (event.mainEventFighters) fighters.push(...event.mainEventFighters);
    if (event.coMainEventFighters) fighters.push(...event.coMainEventFighters);
  }

  if (fighters.length === 0) return null;

  return (
    <>
      {fighters.map((fighter, i) => {
        const countryCode = fighter.country
          ? getCountryCode(fighter.country)
          : undefined;
        const flagUrl = countryCode ? `https://flagcdn.com/${countryCode.toLowerCase()}.svg` : null;
        const cachedImageUrl = getCachedImageUrl(fighter.imageUrl, fighter.updatedAt ?? undefined);
        const optimizedImageUrl = cachedImageUrl
          ? `/_next/image?url=${encodeURIComponent(cachedImageUrl)}&w=256&q=90`
          : null;

        if (!flagUrl && !optimizedImageUrl) return null;

        return (
          <Fragment key={`${fighter.name}-${i}`}>
            {flagUrl && <link rel="preload" as="image" href={flagUrl} />}
            {optimizedImageUrl && <link rel="preload" as="image" href={optimizedImageUrl} />}
          </Fragment>
        );
      })}
    </>
  );
}

// Preload the first N athletes sorted by rank — covers ~3 rows at desktop
const PRELOAD_LIMIT = 12;

export function AthleteImagePreloads({ athletes }: { athletes: Athlete[] }) {
  const toPreload = [...athletes]
    .sort((a, b) => {
      const aRank = a.rank && a.rank > 0 ? a.rank : Infinity;
      const bRank = b.rank && b.rank > 0 ? b.rank : Infinity;
      return aRank - bRank;
    })
    .slice(0, PRELOAD_LIMIT);

  if (toPreload.length === 0) return null;

  return (
    <>
      {toPreload.map((athlete) => {
        const countryCode = getCountryCode(athlete.country);
        const flagUrl = countryCode
          ? `https://flagcdn.com/${countryCode.toLowerCase()}.svg`
          : null;

        const cachedImageUrl = getCachedImageUrl(athlete.imageUrl, athlete.updatedAt);
        // Preload the Next.js optimized version at 256w (covers 2× DPR for 80px container)
        const optimizedImageUrl = cachedImageUrl
          ? `/_next/image?url=${encodeURIComponent(cachedImageUrl)}&w=256&q=90`
          : null;

        if (!flagUrl && !optimizedImageUrl) return null;

        const isHighPriority = athlete.rank === 1;

        return (
          <Fragment key={athlete.id}>
            {flagUrl && (
              <link
                rel="preload"
                as="image"
                href={flagUrl}
                fetchPriority={isHighPriority ? "high" : undefined}
              />
            )}
            {optimizedImageUrl && (
              <link
                rel="preload"
                as="image"
                href={optimizedImageUrl}
                fetchPriority={isHighPriority ? "high" : undefined}
              />
            )}
          </Fragment>
        );
      })}
    </>
  );
}
