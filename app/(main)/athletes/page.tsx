import { getAthletes } from "@/server/actions/get-athlete";
import { Metadata } from "next";
import { AthletesSearch } from "@/components/athletes-search";

export const metadata: Metadata = {
  title: "Athletes | Fight Embedded",
  description: "View all active UFC athletes.",
};

export default async function AthletesPage() {
  const athletes = await getAthletes();

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <h1 className="text-xl sm:text-2xl font-semibold capitalize tracking-tight">
          All UFC Athletes
        </h1>
      </div>

      <AthletesSearch athletes={athletes} />
    </div>
  );
}
