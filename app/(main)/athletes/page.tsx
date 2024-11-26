import { Athlete } from "@prisma/client";
import { getAthletes } from "@/server/actions/athlete";
export default async function AthletesPage() {
  const athletes = await getAthletes();

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold">UFC Athletes</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {athletes.map((athlete: Athlete) => (
          <div key={athlete.id} className="border rounded-lg p-4">
            <h2 className="font-semibold">{athlete.name}</h2>
            <p className="text-sm text-muted-foreground">
              {athlete.weightDivision} • {athlete.country}
            </p>
            <p className="text-sm">
              Record: {athlete.wins}-{athlete.losses}-{athlete.draws}
            </p>
            <p className="text-sm">Age: {athlete.age}</p>
          </div>
        ))}
      </div>
    </main>
  );
} 