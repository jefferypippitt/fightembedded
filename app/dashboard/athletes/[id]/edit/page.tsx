import { Metadata } from "next";
import { AthleteForm } from "@/components/athlete-form";
import { notFound } from "next/navigation";
import { getAthlete } from "@/server/actions/get-athlete";
import { SiteHeader } from "@/components/site-header";

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
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <AthleteForm
                  initialData={{
                    ...athleteData,
                    imageUrl: athleteData.imageUrl || undefined,
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
