import { Metadata } from "next";
import { AthleteForm } from "@/components/athlete-form";
import { notFound } from "next/navigation";
import { getAthlete } from "@/server/actions/get-athlete";

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
      <div className="container max-w-7xl mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">Edit Athlete</h1>
        <AthleteForm
          initialData={{
            ...athleteData,
            imageUrl: athleteData.imageUrl || undefined,
          }}
        />
      </div>
    );
  } catch (error) {
    console.error("Error preparing edit form:", error);
    return notFound();
  }
}
