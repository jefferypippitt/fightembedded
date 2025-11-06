import { Metadata } from "next";
import { AthleteForm } from "@/components/athlete-form";
import { notFound } from "next/navigation";
import { getAthlete } from "@/server/actions/athlete";
import { SiteHeader } from "@/components/site-header";

interface GenerateMetadataProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
  "use cache";
  const { id } = await params;

  try {
    const athlete = await getAthlete(id);
    return {
      title: `Edit ${athlete?.name || "Athlete"}`,
      description: `Edit profile for ${athlete?.name || "athlete"}`,
    };
  } catch {
    return {
      title: "Edit Athlete",
      description: "Edit athlete information",
    };
  }
}

export default async function EditAthletePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  let athlete;

  try {
    athlete = await getAthlete(id);
  } catch (error) {
    console.error("Error loading athlete for edit:", error);
    notFound();
  }

  if (!athlete) {
    notFound();
  }

  const athleteName = athlete.name || "Athlete";
  const athleteData = {
    ...athlete,
    gender: athlete.gender as "MALE" | "FEMALE",
  };

  return (
    <>
      <SiteHeader title={`Edit Athlete › ${athleteName}`} />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-2 py-2 md:gap-2 md:py-2">
            <div className="px-4 lg:px-6">
              <AthleteForm
                key={athlete.id}
                initialData={{
                  ...athleteData,
                  imageUrl: athleteData.imageUrl || undefined,
                  draws: athleteData.draws ?? 0,
                  rank: athleteData.rank ?? 0,
                  poundForPoundRank: athleteData.poundForPoundRank ?? 0,
                  retired: athleteData.retired ?? false,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
