import { Suspense } from "react";
import { AthleteForm } from "@/components/athlete-form";
import { notFound } from "next/navigation";
import { getAthleteForEdit } from "@/server/actions/athlete";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

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

function EditAthleteFormSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full space-y-4">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">Loading athlete data</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Please wait while we load the athlete information. Do not refresh the page.
          </p>
        </div>
      </div>
      <Button variant="outline" size="sm" disabled>
        Cancel
      </Button>
    </div>
  );
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
            <Suspense fallback={<EditAthleteFormSkeleton />}>
              <EditAthleteContent params={params} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}