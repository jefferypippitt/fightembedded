import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AthletesGridSkeleton } from "@/components/athletes-grid-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getAllDivisions,
  getDivisionBySlug,
  getFullDivisionName,
  parseDivisionSlug,
} from "@/data/weight-class";
import { DivisionContent } from "./division-content";

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

export async function generateStaticParams() {
  return getAllDivisions().map((division) => ({ slug: division.slug }));
}

function DivisionPageSkeleton() {
  return (
    <>
      <header className="space-y-2">
        <Skeleton className="h-8 md:h-9 lg:h-10 w-64 sm:w-80" />
        <Skeleton className="h-4 sm:h-5 w-16" />
      </header>
      <AthletesGridSkeleton count={8} />
    </>
  );
}

// Reads the URL param inside the Suspense boundary so the section frame stays
// in the shared App Shell used by Partial Prefetching.
async function DivisionFromParams({ params }: DivisionPageProps) {
  const { slug } = await params;
  return <DivisionDetails slug={slug} />;
}

async function DivisionDetails({ slug }: { slug: string }) {
  "use cache";
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
    <>
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl tracking-tighter">
          {fullName} <span className="text-primary">Division</span>
        </h1>
        {divisionInfo.weight && (
          <p className="text-sm sm:text-base text-muted-foreground">
            {divisionInfo.weight} lbs
          </p>
        )}
      </header>
      <Suspense fallback={<div>Loading athletes...</div>}>
        <DivisionContent slug={slug} />
      </Suspense>
    </>
  );
}

export default function DivisionPage({ params }: DivisionPageProps) {
  return (
    <section className="container space-y-6 pt-4 pb-6">
      <Suspense fallback={<DivisionPageSkeleton />}>
        <DivisionFromParams params={params} />
      </Suspense>
    </section>
  );
}
