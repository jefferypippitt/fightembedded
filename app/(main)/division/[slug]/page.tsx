import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  AthletesSearchContainer,
  AthletesSearchInput,
} from "@/components/athletes-search";
import { Badge } from "@/components/ui/badge";
import { AthletesList } from "@/components/athletes-list";
import {
  getAllDivisions,
  getDivisionBySlug,
  getFullDivisionName,
  parseDivisionSlug,
} from "@/data/weight-class";
import { getDivisionAthletes } from "@/server/actions/athlete";

interface DivisionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: DivisionPageProps): Promise<Metadata> {
  "use cache";
  const { slug } = await params;
  const divisionInfo = getDivisionBySlug(slug);
  const { gender, isValid } = parseDivisionSlug(slug);

  if (!divisionInfo || !isValid) {
    return {
      title: "Division Not Found",
      description: "The requested division could not be found.",
    };
  }

  const fullName = getFullDivisionName(divisionInfo, gender === "women");

  return {
    title: `${fullName} Division - UFC Athletes`,
    description: `View all ${fullName} division athletes, rankings, and statistics.`,
  };
}

export function generateStaticParams() {
  return getAllDivisions().map((division) => ({ slug: division.slug }));
}

function DivisionSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="h-10 w-48 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-64 animate-pulse rounded-md bg-muted" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-48 animate-pulse rounded-xl border border-border/60 bg-muted/40"
          />
        ))}
      </div>
    </div>
  );
}

async function DivisionContent({ slug }: { slug: string }) {
  const divisionData = await getDivisionAthletes(slug);

  if (!divisionData) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="w-full sm:max-w-xs lg:max-w-sm">
        <AthletesSearchInput
          className="w-full"
          athletes={divisionData.athletes}
        />
      </div>
      <AthletesSearchContainer athletes={divisionData.athletes} />
    </div>
  );
}

export default async function DivisionPage({ params }: DivisionPageProps) {
  const { slug } = await params;
  const parseResult = parseDivisionSlug(slug);
  const divisionInfo = getDivisionBySlug(slug);

  if (!divisionInfo || !parseResult.isValid) {
    notFound();
  }

  const fullName = getFullDivisionName(
    divisionInfo,
    parseResult.gender === "women"
  );

  return (
    <section className="container space-y-10 py-10">
      <header className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Division Overview
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <h1 className="text-balance text-2xl font-semibold text-gray-900 dark:text-white sm:text-3xl">
              {fullName}
            </h1>
            {divisionInfo.weight && (
              <Badge variant="outline" className="font-mono">
                {divisionInfo.weight} lbs
              </Badge>
            )}
          </div>
          <p className="text-balance text-sm text-muted-foreground sm:text-base">
            Explore the rankings, records, and profiles of every athlete
            actively competing in the UFC.
          </p>
        </div>
      </header>
      <Suspense fallback={<DivisionSkeleton />}>
        <DivisionContent slug={slug} />
      </Suspense>
    </section>
  );
}
