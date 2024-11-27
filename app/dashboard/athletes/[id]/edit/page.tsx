import { AthleteForm } from "@/components/athlete-form";
import { notFound } from "next/navigation";
import { getAthlete } from "@/server/actions/get-athlete";

interface EditAthletePageProps {
  params: {
    id: string;
  };
}

export default async function EditAthletePage({ params }: EditAthletePageProps) {
  // Check if params is defined and has an id
  if (!params || !params.id) {
    notFound();
  }

  const { id } = params;

  try {
    const athlete = await getAthlete(id);
    console.log("Athlete data from server:", athlete);

    if (!athlete) {
      return notFound();
    }

    // Cast the athlete data to match form types
    const athleteData = {
      ...athlete,
      gender: athlete.gender as "MALE" | "FEMALE"
    };

    return (
      <div className="container max-w-7xl mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">Edit Athlete</h1>
        <AthleteForm initialData={{...athleteData, imageUrl: athleteData.imageUrl || undefined}} />
      </div>
    );
  } catch (error) {
    console.error("Error preparing edit form:", error);
    return notFound();
  }
}


