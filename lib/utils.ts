import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { WEIGHT_DIVISION_ORDER } from "@/lib/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";

  const d = new Date(date);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(d);
}

// Helper function to get division weight for sorting
export function getDivisionWeight(
  division: string,
  gender: "MALE" | "FEMALE"
): number {
  const order = WEIGHT_DIVISION_ORDER[gender];
  const index = order.findIndex((d) =>
    division.toLowerCase().includes(d.toLowerCase())
  );
  return index === -1 ? order.length : index; // Put unknown divisions at the end
}

// Sorting utility for champions by weight division (heaviest to lightest)
export function sortChampionsByDivision<T extends { weightDivision: string }>(
  athletes: T[],
  gender: "MALE" | "FEMALE"
): T[] {
  return [...athletes].sort(
    (a, b) =>
      getDivisionWeight(a.weightDivision, gender) -
      getDivisionWeight(b.weightDivision, gender)
  );
}

/**
 * Creates a cache-busted image URL for aggressive caching while ensuring
 * updated images are fetched immediately.
 * 
 * Uses the athlete's updatedAt timestamp as a version parameter. When the
 * athlete is updated, the URL changes, forcing browsers to fetch the new image.
 * 
 * @param imageUrl - The original image URL (can be null/undefined)
 * @param updatedAt - The athlete's updatedAt timestamp (Date or ISO string)
 * @returns The image URL with cache version parameter, or null if no imageUrl
 * 
 * @example
 * // Image URL stays cached until athlete is updated
 * getCachedImageUrl("https://utfs.io/abc123", new Date("2024-01-01"))
 * // Returns: "https://utfs.io/abc123?v=1704067200000"
 * 
 * // After update, URL changes, forcing fresh fetch
 * getCachedImageUrl("https://utfs.io/abc123", new Date("2024-01-02"))
 * // Returns: "https://utfs.io/abc123?v=1704153600000"
 */
export function getCachedImageUrl(
  imageUrl: string | null | undefined,
  updatedAt: Date | string | null | undefined
): string | null {
  if (!imageUrl) return null;

  // If no updatedAt, return original URL (fallback for backwards compatibility)
  if (!updatedAt) return imageUrl;

  // Convert updatedAt to timestamp (milliseconds)
  const timestamp = updatedAt instanceof Date 
    ? updatedAt.getTime() 
    : new Date(updatedAt).getTime();

  // Add version parameter to URL
  // Check if URL already has query parameters
  const separator = imageUrl.includes("?") ? "&" : "?";
  return `${imageUrl}${separator}v=${timestamp}`;
}
