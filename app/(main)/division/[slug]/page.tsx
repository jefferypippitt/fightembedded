import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getAthletesByDivision } from "@/server/actions/get-athlete";
import { getDivisionBySlug, parseDivisionSlug, getFullDivisionName } from "@/data/weight-class";
import { Skeleton } from "@/components/ui/skeleton";
import { AthleteListCard } from "@/components/athlete-list-card";


async function Athletes({ fullDivisionName }: { fullDivisionName: string }) {
  const athletes = await getAthletesByDivision(fullDivisionName);

  if (athletes.length === 0) {
    return <p className="text-muted-foreground">No athletes found in this division.</p>;
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {athletes.map((athlete) => (
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
        />
      ))}
    </div>
  );
}

// Update the loading skeleton to match AthleteListCard style
function AthleteCardSkeleton() {
  return (
    <div className="border rounded-lg p-2.5">
      <div className="flex items-center gap-2.5">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <div className="flex gap-1.5">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function DivisionPage({ params }: PageProps) {
  const resolvedParams = await params;

  if (!resolvedParams.slug) return notFound();

  // Normalize the slug to lowercase
  const normalizedSlug = typeof resolvedParams.slug === 'string' ? resolvedParams.slug.toLowerCase() : '';

  // Parse and validate the division slug
  const { gender, isValid } = parseDivisionSlug(normalizedSlug);
  if (!isValid) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold">Invalid Division</h1>
        <p className="text-muted-foreground">
          The division &quot;{resolvedParams.slug}&quot; is not valid.
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
      <h1 className="text-2xl font-bold capitalize">{fullDivisionName} Division</h1>
      
      <Suspense fallback={
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <AthleteCardSkeleton key={i} />
          ))}
        </div>
      }>
        <Athletes fullDivisionName={fullDivisionName} />
      </Suspense>
    </main>
  );
}