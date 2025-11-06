import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  AthletesSearchContainer,
  AthletesSearchInput,
} from "@/components/athletes-search";
import { getDivisionAthletes } from "@/server/actions/athlete";
import { Badge } from "@/components/ui/badge";
import { AthletesGridSkeleton } from "@/components/athletes-grid-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
            {divisionData.name} Division
          </h1>
          {divisionData.weight && (
            <Badge variant="outline" className="font-mono">
              {divisionData.weight} lbs
            </Badge>
          )}
        </div>
        <Suspense
          fallback={
            <Skeleton className="w-full sm:w-80 lg:w-96 h-10 rounded-md" />
          }
        >
          <AthletesSearchInput
            className="w-full sm:w-80 lg:w-96"
            athletes={divisionData.athletes}
          />
        </Suspense>
      </div>
      <Suspense fallback={<AthletesGridSkeleton count={8} />}>
        <AthletesSearchContainer athletes={divisionData.athletes} />
      </Suspense>
    </div>
  );
}

export default function DivisionPage({ params }: DivisionPageProps) {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="w-full sm:w-80 lg:w-96 h-10 rounded-md" />
          </div>
          <AthletesGridSkeleton count={8} />
        </div>
      }
    >
      <DivisionContent params={params} />
    </Suspense>
  );
}
