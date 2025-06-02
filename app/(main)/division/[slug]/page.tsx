import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getDivisionBySlug,
  parseDivisionSlug,
  getFullDivisionName,
} from "@/data/weight-class";
import { DivisionContent } from "./division-content";
import { getDivisionAthletes } from "@/server/actions/athlete";

interface GenerateMetadataProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ query?: string }>;
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
  searchParams: Promise<{ query?: string }>;
}

export default async function DivisionPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { query } = await searchParams;

  if (!slug) return notFound();

  // Get division athletes using the server action
  const divisionData = await getDivisionAthletes(slug);
  if (!divisionData) return notFound();

  // Filter athletes based on search query
  const filteredAthletes = query
    ? divisionData.athletes.filter((athlete) => {
        const searchTerm = query.toLowerCase();
        return (
          athlete.name.toLowerCase().includes(searchTerm) ||
          athlete.country.toLowerCase().includes(searchTerm) ||
          athlete.weightDivision.toLowerCase().includes(searchTerm)
        );
      })
    : divisionData.athletes;

  return (
    <div className="space-y-6">
      <div className="flex justify-center mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white capitalize tracking-tight">
          {divisionData.name} Division
        </h1>
      </div>
      <DivisionContent athletes={filteredAthletes} />
    </div>
  );
}
