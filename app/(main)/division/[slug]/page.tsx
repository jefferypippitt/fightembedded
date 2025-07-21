import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDivisionAthletes } from "@/server/actions/athlete";
import { AthletesSearch } from "@/components/athletes-search";
import { getAllDivisions, getDivisionBySlug } from "@/data/weight-class";

export const dynamic = "force-static";
export const revalidate = 604800; // 1 week revalidation

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
    description: `View all active UFC athletes in the ${divisionData.name} division.`,
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

  // Get division weight information
  const divisionInfo = getDivisionBySlug(slug);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-2">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white capitalize tracking-tight">
          {divisionData.name} Division
        </h1>
        {divisionInfo?.weight && (
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium font-mono">
            {divisionInfo.weight} lbs
          </p>
        )}
      </div>

      <AthletesSearch athletes={divisionData.athletes} />
    </div>
  );
}
