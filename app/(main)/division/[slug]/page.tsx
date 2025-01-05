import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import { getAthletesByDivision } from "@/server/actions/get-athlete";
import {
  getDivisionBySlug,
  parseDivisionSlug,
  getFullDivisionName,
} from "@/data/weight-class";
import { AthleteListCard } from "@/components/athlete-list-card";
import { AthleteListCardSkeleton } from "./loading";
import { Badge } from "@/components/ui/badge";

interface GenerateMetadataProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
  // Await the params
  const { slug } = await params;

  // Safety check for undefined slug
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

async function Athletes({ fullDivisionName }: { fullDivisionName: string }) {
  const athletes = await getAthletesByDivision(fullDivisionName);

  if (athletes.length === 0) {
    return (
      <p className="text-muted-foreground">
        No athletes found in this division.
      </p>
    );
  }

  // Sort athletes by rank (ascending order)
  const sortedAthletes = [...athletes].sort((a, b) => {
    if (!a.rank) return 1;
    if (!b.rank) return -1;
    return a.rank - b.rank;
  });

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {sortedAthletes.map((athlete) => (
        <AthleteListCard
          key={athlete.id}
          name={athlete.name}
          weightDivision={athlete.weightDivision}
          imageUrl={athlete.imageUrl || undefined}
          country={athlete.country}
          wins={athlete.wins}
          losses={athlete.losses}
          draws={athlete.draws}
          winsByKo={athlete.winsByKo}
          winsBySubmission={athlete.winsBySubmission}
          rank={athlete.rank}
          followers={athlete.followers}
          age={athlete.age}
          retired={athlete.retired ?? false}
        />
      ))}
    </div>
  );
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function DivisionPage({ params }: PageProps) {
  // Await the params
  const { slug } = await params;

  if (!slug) return notFound();

  // Normalize the slug to lowercase
  const normalizedSlug = slug.toLowerCase();

  // Parse and validate the division slug
  const { gender, isValid } = parseDivisionSlug(normalizedSlug);
  if (!isValid) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold">Invalid Division</h1>
        <p className="text-muted-foreground">
          The division &quot;{slug}&quot; is not valid.
        </p>
      </main>
    );
  }

  // Get the division details
  const division = getDivisionBySlug(normalizedSlug);
  if (!division) return notFound();

  // Get the full division name
  const isWomen = gender === "women";
  const fullDivisionName = getFullDivisionName(division, isWomen).toLowerCase();

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex justify-center">
        <Badge
          variant="outline"
          className="px-3 py-0.5 text-base sm:text-lg bg-red-500/10 text-red-600 dark:text-red-400 border-red-600/20 dark:border-red-500/30 capitalize font-medium"
        >
          {fullDivisionName} Division
        </Badge>
      </div>
      <Suspense
        fallback={
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(9)].map((_, i) => (
              <AthleteListCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <Athletes fullDivisionName={fullDivisionName} />
      </Suspense>
    </main>
  );
}
