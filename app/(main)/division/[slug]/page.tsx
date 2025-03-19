import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import { getAthletesByDivision } from "@/server/actions/get-athlete";
import {
  getDivisionBySlug,
  parseDivisionSlug,
  getFullDivisionName,
} from "@/data/weight-class";
import { AthletesGridSkeleton } from "@/components/athlete-skeleton";
import { AthletesClient } from "@/app/(main)/athletes/athletes-client";
import { unstable_noStore as noStore } from "next/cache";


interface GenerateMetadataProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
  const { slug } = await params;

  if (!slug) {
    return {
      title: "Division Not Found",
      description: "The requested weight division could not be found.",
    };
  }

  const normalizedSlug = slug.toLowerCase();
  const { gender, isValid } = parseDivisionSlug(normalizedSlug);

  if (!isValid) {
    return {
      title: "Invalid Division",
      description: "This weight division does not exist in Fight Embedded.",
    };
  }

  const division = getDivisionBySlug(normalizedSlug);
  if (!division) {
    return {
      title: "Division Not Found",
      description: "The requested weight division could not be found.",
    };
  }

  const isWomen = gender === "women";
  const fullDivisionName = getFullDivisionName(division, isWomen);
  const capitalizedDivisionName = fullDivisionName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `${capitalizedDivisionName} Division`,
    description: `Explore UFC ${capitalizedDivisionName} division athletes, rankings, stats, and performance analytics on Fight Embedded.`,
    openGraph: {
      title: `${capitalizedDivisionName} Division | Fight Embedded`,
      description: `View detailed statistics and rankings for UFC ${capitalizedDivisionName} division fighters. Get comprehensive analytics and performance data.`,
      type: "website",
      siteName: "Fight Embedded",
    },
    twitter: {
      card: "summary",
      title: `${capitalizedDivisionName} Division | Fight Embedded`,
      description: `Complete stats and rankings for UFC ${capitalizedDivisionName} division athletes. Access detailed performance metrics and analytics.`,
    },
  };
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function DivisionContent({ slug }: { slug: string }) {
  // Disable caching for this component
  noStore();

  // Normalize the slug to lowercase
  const normalizedSlug = slug.toLowerCase();

  // Parse and validate the division slug
  const { gender, isValid } = parseDivisionSlug(normalizedSlug);
  if (!isValid) {
    return (
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">Invalid Division</h1>
        <p className="text-muted-foreground">
          The division &quot;{slug}&quot; is not valid.
        </p>
      </div>
    );
  }

  // Get the division details
  const division = getDivisionBySlug(normalizedSlug);
  if (!division) return notFound();

  // Get the full division name
  const isWomen = gender === "women";
  const fullDivisionName = getFullDivisionName(division, isWomen).toLowerCase();

  // Fetch athletes for this division
  const athletes = await getAthletesByDivision(fullDivisionName);

  // Sort athletes by rank (ascending order)
  const sortedAthletes = [...athletes].sort((a, b) => {
    // Handle unranked athletes (put them at the end)
    if (!a.rank) return 1;
    if (!b.rank) return -1;
    return a.rank - b.rank;
  });

  return <AthletesClient athletes={sortedAthletes} />;
}

export default async function DivisionPage({ params }: PageProps) {
  const { slug } = await params;

  if (!slug) return notFound();

  // Get the division details for the title
  const normalizedSlug = slug.toLowerCase();
  const { gender, isValid } = parseDivisionSlug(normalizedSlug);
  const division = getDivisionBySlug(normalizedSlug);
  
  if (!isValid || !division) return notFound();

  const isWomen = gender === "women";
  const fullDivisionName = getFullDivisionName(division, isWomen).toLowerCase();

  return (
    <div className="space-y-6">
      <div className="flex justify-center mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white capitalize tracking-tight">
          {fullDivisionName} Division
        </h1>
      </div>
      <Suspense fallback={<AthletesGridSkeleton count={9} />}>
        <DivisionContent slug={slug} />
      </Suspense>
    </div>
  );
}
