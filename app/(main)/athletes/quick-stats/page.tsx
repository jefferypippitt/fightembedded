import { Metadata } from "next";
import { AthleteImagePreloads } from "@/components/athlete-image-preloads";
import { QuickStatsView } from "@/components/quick-stats-view";
import { getQuickStatsPageData } from "@/server/data/athlete";
import type { Athlete, QuickStatsPageData } from "@/types/athlete";

export const metadata: Metadata = {
  title: "UFC Insights",
  description:
    "Snapshot of standout stats across the organization.",
};

const PAGE_INTRO =
  "Snapshot of standout stats across the organization.";

function athletesForPreload(data: QuickStatsPageData): Athlete[] {
  const seen = new Set<string>();
  const result: Athlete[] = [];
  const addSection = (athletes: Athlete[]) => {
    for (const a of athletes) {
      if (!seen.has(a.id)) {
        seen.add(a.id);
        result.push(a);
      }
    }
  };
  addSection(data.undefeated);
  addSection(data.currentChampions);
  addSection(data.mostFollowed);
  addSection(data.mostFollowedRetiredMale);
  addSection(data.mostFollowedRetiredFemale);
  addSection(data.newestAdded);
  addSection(data.recentlyRetired);
  addSection(data.bestSubmissionRate);
  addSection(data.bestKoRate);
  addSection(data.oldest);
  addSection(data.youngest);
  return result;
}

export default async function AthletesQuickStatsPage() {
  const data = await getQuickStatsPageData();
  const preloadAthletes = athletesForPreload(data);

  return (
    <section className="container space-y-8 pt-4 pb-10">
      <AthleteImagePreloads athletes={preloadAthletes} sortByRank={false} />
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl tracking-tighter">
          UFC <span className="text-primary">Insights</span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
          {PAGE_INTRO}
        </p>
      </header>
      <QuickStatsView data={data} />
    </section>
  );
}
