import { cacheLife, cacheTag } from "next/cache";
import prisma from "@/lib/prisma";
import { sortChampionsByDivision } from "@/lib/utils";
import {
  topAthletesBySubmissionRate,
  topAthletesByKoRate,
  QUICK_STATS_MIN_WINS_FOR_FINISH_RATE,
  QUICK_STATS_MOST_FOLLOWED_LIMIT,
  QUICK_STATS_RECENT_ADDITIONS_LIMIT,
} from "@/lib/quick-stats";
import type { QuickStatsPageData, QuickStatsTopCountry } from "@/types/athlete";

/** Snapshot for /athletes/quick-stats — shares cache tags with related lists */
export async function getQuickStatsPageData(): Promise<QuickStatsPageData> {
  "use cache";
  cacheLife("days");
  cacheTag("undefeated-athletes");
  cacheTag("country-stats");
  cacheTag("athletes");
  cacheTag("champions-data");
  cacheTag("homepage-champions");

  try {
    const [
      undefeated,
      championsRaw,
      countryAgg,
      oldest,
      youngest,
      mostFollowed,
      mostFollowedRetiredMale,
      mostFollowedRetiredFemale,
      newestAdded,
      recentlyRetired,
      athletesForFinishRates,
    ] = await Promise.all([
      prisma.athlete.findMany({
        where: { losses: 0, retired: false },
        orderBy: [{ wins: "desc" }, { name: "asc" }],
      }),
      prisma.athlete.findMany({
        where: { rank: 1, retired: false },
        orderBy: [{ name: "asc" }],
      }),
      prisma.athlete.groupBy({
        by: ["country"],
        where: { retired: false, country: { not: "" } },
        _count: { country: true },
        orderBy: { _count: { country: "desc" } },
      }),
      prisma.athlete.findMany({
        where: { retired: false },
        orderBy: [{ age: "desc" }, { name: "asc" }],
        take: 10,
      }),
      prisma.athlete.findMany({
        where: { retired: false },
        orderBy: [{ age: "asc" }, { name: "asc" }],
        take: 10,
      }),
      prisma.athlete.findMany({
        where: { retired: false },
        orderBy: [{ followers: "desc" }, { name: "asc" }],
        take: QUICK_STATS_MOST_FOLLOWED_LIMIT,
      }),
      prisma.athlete.findMany({
        where: { retired: true, gender: "MALE" },
        orderBy: [{ followers: "desc" }, { name: "asc" }],
        take: 5,
      }),
      prisma.athlete.findMany({
        where: { retired: true, gender: "FEMALE" },
        orderBy: [{ followers: "desc" }, { name: "asc" }],
        take: 5,
      }),
      prisma.athlete.findMany({
        where: { retired: false },
        orderBy: [{ createdAt: "desc" }],
        take: QUICK_STATS_RECENT_ADDITIONS_LIMIT,
      }),
      prisma.athlete.findMany({
        where: { retired: true },
        orderBy: [{ rank: "asc" }, { name: "asc" }],
        take: QUICK_STATS_RECENT_ADDITIONS_LIMIT,
      }),
      prisma.athlete.findMany({
        where: {
          retired: false,
          wins: { gte: QUICK_STATS_MIN_WINS_FOR_FINISH_RATE },
        },
      }),
    ]);

    const bestSubmissionRate = topAthletesBySubmissionRate(athletesForFinishRates);
    const bestKoRate = topAthletesByKoRate(athletesForFinishRates);

    const maleChamps = championsRaw.filter((a) => a.gender === "MALE");
    const femaleChamps = championsRaw.filter((a) => a.gender === "FEMALE");
    const currentChampions = [
      ...sortChampionsByDivision(maleChamps, "MALE"),
      ...sortChampionsByDivision(femaleChamps, "FEMALE"),
    ];

    const filtered: QuickStatsTopCountry[] = countryAgg
      .filter((s) => s.country.trim().length > 0)
      .map((row) => ({
        country: row.country,
        count: row._count.country,
      }));

    const byDesc = [...filtered].sort(
      (a, b) => b.count - a.count || a.country.localeCompare(b.country)
    );
    const topCountries = byDesc.slice(0, 8);
    const topNames = new Set(topCountries.map((r) => r.country));
    const leastCountries = filtered
      .filter((r) => !topNames.has(r.country))
      .sort((a, b) => a.count - b.count || a.country.localeCompare(b.country))
      .slice(0, 8);

    return {
      undefeated,
      currentChampions,
      mostFollowed,
      mostFollowedRetiredMale,
      mostFollowedRetiredFemale,
      newestAdded,
      recentlyRetired,
      bestSubmissionRate,
      bestKoRate,
      topCountries,
      leastCountries,
      oldest,
      youngest,
    };
  } catch (error) {
    console.error("Error fetching quick stats page data:", error);
    return {
      undefeated: [],
      currentChampions: [],
      mostFollowed: [],
      mostFollowedRetiredMale: [],
      mostFollowedRetiredFemale: [],
      newestAdded: [],
      recentlyRetired: [],
      bestSubmissionRate: [],
      bestKoRate: [],
      topCountries: [],
      leastCountries: [],
      oldest: [],
      youngest: [],
    };
  }
}
