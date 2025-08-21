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
