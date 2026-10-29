import { revalidatePath, revalidateTag } from "next/cache";

/**
 * Shared cache invalidation helper for athlete-related data
 * Revalidates all relevant cache tags and paths when athlete data changes
 */
export function invalidateAthleteCache(options?: {
  athleteId?: string;
  hasImage?: boolean;
  isChampion?: boolean;
  isUndefeated?: boolean;
  isRetired?: boolean;
  hasP4PRank?: boolean;
  followersChanged?: boolean;
  rankChanged?: boolean;
  p4pRankChanged?: boolean;
  retiredStatusChanged?: boolean;
  lossesChanged?: boolean;
  divisionChanged?: boolean;
  imageChanged?: boolean;
  weightDivision?: string;
  newWeightDivision?: string;
}): void {
  const {
    athleteId,
    hasImage = false,
    isChampion = false,
    isUndefeated = false,
    isRetired = false,
    hasP4PRank = false,
    followersChanged = false,
    rankChanged = false,
    p4pRankChanged = false,
    retiredStatusChanged = false,
    lossesChanged = false,
    divisionChanged = false,
    imageChanged = false,
    weightDivision,
    newWeightDivision,
  } = options || {};

  // Always revalidate basic athlete data
  revalidateTag("all-athletes", "max");
  revalidateTag("all-athletes-data", "max");
  revalidateTag("live-stats", "max");
  revalidateTag("stats", "max");
  revalidateTag("athletes-page", "max");
  revalidateTag("athletes-by-division", "max");
  revalidateTag("division-athletes", "max");
  revalidateTag("athletes", "max");
  revalidateTag("homepage", "max");
  revalidateTag("top-20-athletes", "max");
  revalidateTag("top-5-athletes", "max");
  revalidateTag("country-stats", "max");

  if (athleteId) {
    revalidateTag("athlete-by-id", "max");
    revalidateTag(`athlete-${athleteId}`, "max");
    revalidateTag(`athlete-edit-${athleteId}`, "max");
  }

  // Only revalidate image-related caches if athlete has an image or image changed
  if (hasImage || imageChanged) {
    revalidateTag("athlete-images", "max");
  }

  // Only revalidate specific caches based on athlete properties
  if (isChampion) {
    revalidateTag("champions-data", "max");
    revalidateTag("homepage-champions", "max");
  }

  if (isUndefeated || (lossesChanged && isUndefeated)) {
    revalidateTag("undefeated-athletes", "max");
  }

  if (isRetired || retiredStatusChanged) {
    revalidateTag("retired-athletes-data", "max");
    revalidateTag("retired-page", "max");
  }

  if (hasP4PRank) {
    revalidateTag("p4p-rankings-data", "max");
    revalidateTag("homepage-p4p", "max");
  }

  // Rankings-related revalidation
  if (rankChanged || p4pRankChanged) {
    revalidateTag("p4p-rankings-data", "max");
    revalidateTag("homepage-p4p", "max");
    revalidatePath("/rankings/divisions", "page");
    if (isChampion) {
      revalidateTag("champions-data", "max");
      revalidateTag("homepage-champions", "max");
    }
  }

  // Revalidate popularity rankings if followers changed
  if (followersChanged) {
    revalidatePath("/rankings/popularity", "page");
    revalidatePath("/rankings/all-time", "page");
  }

  if (retiredStatusChanged) {
    revalidatePath("/rankings/all-time", "page");
    revalidatePath("/retired", "page");
  }

  // Only revalidate homepage if significant changes occurred
  if (rankChanged || p4pRankChanged || retiredStatusChanged || isChampion || hasP4PRank) {
    revalidateTag("homepage", "max");
    revalidateTag("homepage-stats", "max");
    revalidatePath("/", "page");
  }

  // Revalidate main pages
  revalidatePath("/athletes", "page");

  // Revalidate specific division paths if we know the division
  if (weightDivision) {
    const isWomen = weightDivision.startsWith("Women's");
    const divisionName = weightDivision.replace(/^(Women's|Men's)\s+/, "");
    const divisionSlug = divisionName.toLowerCase().replace(/\s+/g, "-");
    const fullSlug = `${isWomen ? "women" : "men"}-${divisionSlug}`;
    revalidatePath(`/division/${fullSlug}`, "page");
  }

  // If division changed, also revalidate the new division path
  if (divisionChanged && newWeightDivision) {
    const isWomen = newWeightDivision.startsWith("Women's");
    const divisionName = newWeightDivision.replace(/^(Women's|Men's)\s+/, "");
    const divisionSlug = divisionName.toLowerCase().replace(/\s+/g, "-");
    const fullSlug = `${isWomen ? "women" : "men"}-${divisionSlug}`;
    revalidatePath(`/division/${fullSlug}`, "page");
  }
}

/**
 * Revalidate all athlete-related caches and paths
 * Used for comprehensive cache invalidation when needed
 */
export function revalidateAllCaches(): void {
  // Revalidate all cache tags
  revalidateTag("all-athletes", "max");
  revalidateTag("all-athletes-data", "max");
  revalidateTag("live-stats", "max");
  revalidateTag("stats", "max");
  revalidateTag("athletes-page", "max");
  revalidateTag("athlete-by-id", "max");
  revalidateTag("athletes-by-division", "max");
  revalidateTag("division-athletes", "max");
  revalidateTag("athletes", "max");
  revalidateTag("homepage", "max");
  revalidateTag("top-20-athletes", "max");
  revalidateTag("top-5-athletes", "max");
  revalidateTag("country-stats", "max");
  revalidateTag("athlete-images", "max");
  revalidateTag("champions-data", "max");
  revalidateTag("homepage-champions", "max");
  revalidateTag("p4p-rankings-data", "max");
  revalidateTag("homepage-p4p", "max");
  revalidateTag("retired-athletes-data", "max");
  revalidateTag("retired-page", "max");
  revalidateTag("undefeated-athletes", "max");
  revalidateTag("homepage-stats", "max");

  // Revalidate all main paths
  revalidatePath("/", "page");
  revalidatePath("/athletes", "page");
  revalidatePath("/retired", "page");
  revalidatePath("/rankings/divisions", "page");
  revalidatePath("/rankings/popularity", "page");
  revalidatePath("/rankings/all-time", "page");

  // Revalidate all division paths
  const divisions = [
    "men-heavyweight",
    "men-light-heavyweight",
    "men-middleweight",
    "men-welterweight",
    "men-lightweight",
    "men-featherweight",
    "men-bantamweight",
    "men-flyweight",
    "women-featherweight",
    "women-bantamweight",
    "women-flyweight",
    "women-strawweight",
  ];

  divisions.forEach((slug) => {
    revalidatePath(`/division/${slug}`, "page");
  });
}

/**
 * Shared cache invalidation helper for event-related data
 * Revalidates all relevant cache tags and paths when event data changes
 */
export function invalidateEventCache(options?: {
  eventId?: string;
  isUpcoming?: boolean;
}): void {
  const { eventId, isUpcoming = false } = options || {};

  // Always revalidate basic event data
  revalidateTag("all-events", "max");
  revalidateTag("upcoming-events", "max");
  revalidateTag("live-upcoming-events", "max");
  revalidateTag("stats", "max");
  revalidateTag("live-stats", "max");

  if (eventId) {
    revalidateTag(`event-${eventId}`, "max");
    revalidateTag(`event-edit-${eventId}`, "max");
  }

  // Revalidate public pages if the event is upcoming
  if (isUpcoming) {
    revalidatePath("/events", "page");
    revalidatePath("/", "page");
  }
}
