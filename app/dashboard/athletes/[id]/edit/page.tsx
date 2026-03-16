import { AthleteForm } from "@/components/athlete-form";
import { notFound } from "next/navigation";
import { getAthleteForEdit } from "@/server/actions/athlete";

async function EditAthleteContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let athlete;

  try {
    athlete = await getAthleteForEdit(id);
  } catch (error) {
    console.error("Error loading athlete for edit:", error);
    notFound();
  }

  if (!athlete) {
    notFound();
  }

  return <AthleteForm initialData={athlete} />;
}

export default function EditAthletePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-2 py-2 md:gap-2 md:py-2">
          <div className="px-4 lg:px-6">
            <EditAthleteContent params={params} />
          </div>
        </div>
      </div>
    </div>
  );
}