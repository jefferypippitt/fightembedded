import type { Athlete } from "@/types/athlete";

export const QUICK_STATS_MIN_WINS_FOR_FINISH_RATE = 5;

export const QUICK_STATS_FINISH_RATE_TOP_N = 5;

export const QUICK_STATS_MOST_FOLLOWED_LIMIT = 10;

export const QUICK_STATS_RECENT_ADDITIONS_LIMIT = 5;

function sortByFinishRate(
  athletes: Athlete[],
  winsInKind: (a: Athlete) => number
): Athlete[] {
  const minWins = QUICK_STATS_MIN_WINS_FOR_FINISH_RATE;
  return [...athletes]
    .filter((a) => a.wins >= minWins && a.wins > 0)
    .map((a) => {
      const kind = winsInKind(a);
      const rate = kind / a.wins;
      return { a, rate, kind };
    })
    .sort((x, y) => {
      if (y.rate !== x.rate) return y.rate - x.rate;
      if (y.kind !== x.kind) return y.kind - x.kind;
      return x.a.name.localeCompare(y.a.name);
    })
    .slice(0, QUICK_STATS_FINISH_RATE_TOP_N)
    .map((x) => x.a);
}

export function topAthletesBySubmissionRate(athletes: Athlete[]): Athlete[] {
  return sortByFinishRate(athletes, (a) => a.winsBySubmission);
}

export function topAthletesByKoRate(athletes: Athlete[]): Athlete[] {
  return sortByFinishRate(athletes, (a) => a.winsByKo);
}
