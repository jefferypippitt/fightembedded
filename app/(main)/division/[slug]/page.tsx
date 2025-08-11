import { Metadata } from "next";
import { notFound } from "next/navigation";
import { AthletesSearchContainer } from "@/components/athletes-search";
import { getDivisionAthletes } from "@/server/actions/athlete";
import { getDivisionBySlug } from "@/data/weight-class";

interface DivisionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: DivisionPageProps): Promise<Metadata> {
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

export default async function DivisionPage({ params }: DivisionPageProps) {
  const { slug } = await params;
  const divisionData = await getDivisionAthletes(slug);

  if (!divisionData) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-2">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white capitalize tracking-tight">
          {divisionData.name} Division
        </h1>
        <p className="text-sm sm:text-base font-mono text-muted-foreground">
          {(() => {
            const division = getDivisionBySlug(slug);
            return division?.weight ? `${division.weight} lbs` : "";
          })()}
        </p>
      </div>

      <AthletesSearchContainer
        athletes={divisionData.athletes}
        placeholder={`Search ${divisionData.name} division athletes...`}
      />
    </div>
  );
}
