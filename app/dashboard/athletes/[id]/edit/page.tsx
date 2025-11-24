import { Suspense } from "react";
import { AthleteForm } from "@/components/athlete-form";
import { notFound } from "next/navigation";
import { getAthlete } from "@/server/actions/athlete";
import { Skeleton } from "@/components/ui/skeleton";

async function EditAthleteForm({ id }: { id: string }) {
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

  const athleteData = {
    ...athlete,
    gender: athlete.gender as "MALE" | "FEMALE",
  };

  return (
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
  );
}

function EditAthleteFormSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
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

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-2 py-2 md:gap-2 md:py-2">
          <div className="px-4 lg:px-6">
            <Suspense fallback={<EditAthleteFormSkeleton />}>
              <EditAthleteForm id={id} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
