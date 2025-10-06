import { Metadata } from "next";
import { notFound } from "next/navigation";
import { AthletesSearchContainer } from "@/components/athletes-search";
import { getDivisionAthletes } from "@/server/actions/athlete";

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
      <AthletesSearchContainer
        athletes={divisionData.athletes}
        placeholder={`Search active athletes...`}
        title={`${divisionData.name} Division`}
        weight={divisionData.weight}
      />
    </div>
  );
}
