import { Metadata } from "next";
import { AthleteForm } from "@/components/athlete-form";
import { notFound } from "next/navigation";
import { getAthlete } from "@/server/actions/athlete";
import { SiteHeader } from "@/components/site-header";
import { unstable_noStore as noStore } from "next/cache";

interface GenerateMetadataProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
  // Await the params
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

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAthletePage({ params }: PageProps) {
  // Disable caching for this page
  noStore();

  // Await the params
  const { id } = await params;

  if (!id) {
    notFound();
  }

  try {
    const athlete = await getAthlete(id);

    if (!athlete) {
      return notFound();
    }

    // Cast the athlete data to match form types
    const athleteData = {
      ...athlete,
      gender: athlete.gender as "MALE" | "FEMALE",
    };

    return (
      <>
        <SiteHeader title={`Edit ${athlete.name}`} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-2 py-2 md:gap-2 md:py-2">
              <div className="px-4 lg:px-6">
                <AthleteForm
                  key={athlete.id} // Add key to force re-render when data changes
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
  } catch (error) {
    console.error("Error preparing edit form:", error);
    return notFound();
  }
}
