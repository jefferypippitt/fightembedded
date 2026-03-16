"use cache";

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
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

export default async function DivisionPage({ params }: DivisionPageProps) {
  const { slug } = await params;
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
    <section className="container space-y-6 pt-4 pb-6">
      <header className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Division Overview{divisionInfo.weight && (
              <span className="text-muted-foreground"> - {divisionInfo.weight} lbs</span>
            )}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <h1 className="text-balance text-2xl font-semibold sm:text-3xl">
              {fullName}
            </h1>
          </div>
        </div>
      </header>
      <Suspense fallback={<div>Loading athletes...</div>}>
        <DivisionContent slug={slug} />
      </Suspense>
    </section>
  );
}
