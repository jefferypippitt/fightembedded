import { AthleteForm } from "@/components/athlete-form";
import { notFound } from "next/navigation";
import { athleteSchema } from "@/schemas/athlete";
import { getAthlete } from "@/server/actions/get-athlete";

interface EditAthletePageProps {
  params: {
    id: string;
  };
}

export default async function EditAthletePage({ params }: EditAthletePageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  try {
    const athlete = await getAthlete(id);
    if (!athlete) {
      return notFound();
    }

    // Transform the athlete data to match the form schema
    const formData = {
      id: athlete.id,
      name: athlete.name,
      gender: athlete.gender as "MALE" | "FEMALE",
      age: athlete.age,
      weightDivision: athlete.weightDivision,
      country: athlete.country,
      wins: athlete.wins,
      losses: athlete.losses,
      draws: athlete.draws,
      koRate: athlete.koRate,
      submissionRate: athlete.submissionRate,
      followers: athlete.followers,
      rank: athlete.rank,
      poundForPoundRank: athlete.poundForPoundRank,
      imageUrl: athlete.imageUrl,
    };

    // Validate the transformed data
    const validatedData = athleteSchema.parse(formData);

    return (
      <div className="container max-w-7xl mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">Edit Athlete</h1>
        <AthleteForm initialData={{ ...validatedData, id: athlete.id }} />
      </div>
    );
  } catch (error) {
    console.error("Error preparing edit form:", error);
    return notFound();
  }
}


