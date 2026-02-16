import type { Athlete } from "@/types/athlete";
import { getCountryCode } from "@/lib/country-codes";

const PRELOAD_LIMIT = 40;

export function AthleteImagePreloads({ athletes }: { athletes: Athlete[] }) {
  const toPreload = athletes
    .filter((a) => a.imageUrl)
    .slice(0, PRELOAD_LIMIT);

  if (toPreload.length === 0) return null;

  return (
    <>
      {toPreload.map((athlete) => {
        const countryCode = getCountryCode(athlete.country);
        const flagUrl = countryCode
          ? `https://flagcdn.com/${countryCode.toLowerCase()}.svg`
          : null;

        if (!flagUrl) return null;

        const isHighPriority = athlete.rank === 1;

        return (
          <link
            key={athlete.id}
            rel="preload"
            as="image"
            href={flagUrl}
            fetchPriority={isHighPriority ? "high" : undefined}
          />
        );
      })}
    </>
  );
}
