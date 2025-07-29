import { AthleteForm } from "@/components/athlete-form";
import { SiteHeader } from "@/components/site-header";

export default function NewAthletePage() {
  return (
    <>
      <SiteHeader title="Add New Athlete" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-2 py-2 md:gap-2 md:py-2">
            <div className="px-4 lg:px-6">
              <AthleteForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
