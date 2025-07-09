import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDivisionAthletes } from "@/server/actions/athlete";
import { DivisionContent } from "./division-content";
import { getAllDivisions } from "@/data/weight-class";
import { Suspense } from "react";
import { AthletesGridSkeleton } from "@/components/athlete-skeleton";

// Use static rendering for division pages - following Next.js best practices
export const dynamic = "force-static";
export const revalidate = 604800; // Cache for a week

interface GenerateMetadataProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
  const { slug } = await params;
  const divisionData = await getDivisionAthletes(slug);

  if (!divisionData) {
    return {
      title: "Division Not Found",
      description: "The requested division could not be found.",
    };
  }

  return {
    title: `${divisionData.name} Division`,
    description: `View all active fighters in the ${divisionData.name} division.`,
  };
}

// Generate static params for all divisions
export async function generateStaticParams() {
  const divisions = getAllDivisions();
  return divisions.map((division) => ({
    slug: division.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function DivisionPage({ params }: PageProps) {
  const { slug } = await params;

  if (!slug) return notFound();

  // Get division athletes using the server action
  const divisionData = await getDivisionAthletes(slug);
  if (!divisionData) return notFound();

  return (
    <div className="space-y-6">
      <div className="flex justify-center mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white capitalize tracking-tight">
          {divisionData.name} Division
        </h1>
      </div>
      <Suspense fallback={<AthletesGridSkeleton count={12} />}>
        <DivisionContent athletes={divisionData.athletes} />
      </Suspense>
    </div>
  );
}
