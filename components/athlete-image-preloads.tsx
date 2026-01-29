import type { Athlete } from "@/types/athlete";
import { getCountryCode } from "@/lib/country-codes";
import { getCachedImageUrl } from "@/lib/utils";

const PRELOAD_LIMIT = 40;

/**
 * Renders preload links for athlete images AND flag images so the browser starts
 * fetching them in parallel as soon as the HTML is parsed. This eliminates
 * waterfall loading by parallelizing both image requests with the initial page
 * load (per Vercel async-parallel best practice).
 * 
 * Both images are preloaded together so they load simultaneously, preventing
 * the flag background from loading after the athlete image.
 * 
 * Uses cached image URLs with version parameters for aggressive caching while
 * ensuring updated images are fetched immediately.
 */
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

        // Get cached image URL with version parameter for cache busting
        const cachedImageUrl = getCachedImageUrl(
          athlete.imageUrl || null,
          athlete.updatedAt
        );

        // Priority for preload: rank 1 athletes get high priority
        // (champions on homepage, top ranked on division pages)
        const isHighPriority = athlete.rank === 1;

        return (
          <span key={athlete.id}>
            {/* Preload athlete image with cache version */}
            {cachedImageUrl && (
              <link
                rel="preload"
                as="image"
                href={cachedImageUrl}
                fetchPriority={isHighPriority ? "high" : undefined}
              />
            )}
            {/* Preload flag image in parallel */}
            {flagUrl && (
              <link
                rel="preload"
                as="image"
                href={flagUrl}
                fetchPriority={isHighPriority ? "high" : undefined}
              />
            )}
          </span>
        );
      })}
    </>
  );
}
