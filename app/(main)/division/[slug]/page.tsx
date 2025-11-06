import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  AthletesSearchContainer,
  AthletesSearchInput,
} from "@/components/athletes-search";
import { getDivisionAthletes } from "@/server/actions/athlete";
import { Badge } from "@/components/ui/badge";
import { AthletesList } from "@/components/athletes-list";

interface DivisionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: DivisionPageProps): Promise<Metadata> {
  "use cache";
  const { slug } = await params;
  const divisionData = await getDivisionAthletes(slug);

  if (!divisionData) {
    return {
      title: "Division Not Found",
      description: "The requested division could not be found.",
    };
  }

  return {
    title: `${divisionData.name} Division - UFC Athletes`,
    description: `View all ${divisionData.name} division athletes, rankings, and statistics.`,
  };
}

async function DivisionContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  "use cache";
  const { slug } = await params;
  const divisionData = await getDivisionAthletes(slug);

  if (!divisionData) {
    notFound();
  }

  return (
    <section className="container space-y-10 py-10">
      <header className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-primary uppercase tracking-wide">
              Division Overview
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <h1 className="text-balance text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">
                {divisionData.name}
              </h1>
              {divisionData.weight && (
                <Badge variant="outline" className="font-mono">
                  {divisionData.weight} lbs
                </Badge>
              )}
            </div>
            <p className="text-sm sm:text-base text-muted-foreground text-balance">
              Explore the rankings, records, and profiles of every athlete
              actively competing in the {divisionData.name.toLowerCase()}.
            </p>
          </div>
          <div className="w-full sm:max-w-xs lg:max-w-sm">
            <Suspense fallback={null}>
              <AthletesSearchInput
                className="w-full"
                athletes={divisionData.athletes}
              />
            </Suspense>
          </div>
        </div>
      </header>
      <div className="space-y-8">
        <Suspense fallback={null}>
          <AthletesSearchContainer athletes={divisionData.athletes} />
        </Suspense>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Full Roster
          </h2>
          <AthletesList
            athletes={divisionData.athletes}
            emptyMessage="No athletes found in this division."
          />
        </div>
      </div>
    </section>
  );
}

export default function DivisionPage({ params }: DivisionPageProps) {
  return (
    <Suspense fallback={null}>
      <DivisionContent params={params} />
    </Suspense>
  );
}
