import { Button } from "@/components/ui/button";

import Link from "next/link";

import { PlusCircle, Pencil } from "lucide-react";
import { getAthletes } from "@/server/actions/athlete";

export default async function DashboardAthletesPage() {
  const athletes = await getAthletes();

  return (
    <div className="container max-w-7xl mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Athletes</h1>

        <Button asChild>
          <Link href="/dashboard/new-athlete">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Athlete
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {athletes.map((athlete) => (
          <div key={athlete.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="font-semibold">{athlete.name}</h2>

                <p className="text-sm text-muted-foreground">
                  {athlete.weightDivision} • {athlete.country}
                </p>
              </div>

              <Button variant="ghost" size="icon" asChild>
                <Link href={`/dashboard/athletes/${athlete.id}/edit`}>
                  <Pencil className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="space-y-1">
              <p className="text-sm">
                Record: {athlete.wins}-{athlete.losses}-{athlete.draws}
              </p>

              <p className="text-sm">Wins by Knock Out: {athlete.koRate}</p>

              <p className="text-sm">
                Wins by Submission: {athlete.submissionRate}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
