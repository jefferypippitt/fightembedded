import { notFound } from "next/navigation";
import { getAthletesByDivision } from "@/server/actions/get-athlete";
import { getDivisionBySlug, parseDivisionSlug, getFullDivisionName } from "@/data/weight-class";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function DivisionPage({ params }: PageProps) {
  try {
    // Await the params to access slug
    const { slug } = await params;
    console.log('Received slug:', slug);
    if (!slug) return notFound();

    // Normalize the slug to lowercase
    const normalizedSlug = slug.toLowerCase();

    // Parse and validate the division slug
    const { gender, isValid } = parseDivisionSlug(normalizedSlug);
    if (!isValid) {
      return (
        <main className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">Invalid Division</h1>
          <p className="text-muted-foreground">The division &quot;{slug}&quot; is not valid.</p>
        </main>
      );
    }

    // Get the division details
    const division = getDivisionBySlug(normalizedSlug);
    if (!division) return notFound();

    // Get the full division name
    const isWomen = gender === "women";
    const fullDivisionName = getFullDivisionName(division, isWomen).toLowerCase();
    console.log('Full Division Name:', fullDivisionName);

    // Fetch athletes for this division
    const athletes = await getAthletesByDivision(fullDivisionName);
    console.log('Athletes found for division:', fullDivisionName, athletes);

    return (
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <h1 className="text-2xl font-bold">{fullDivisionName} Division</h1>
        
        {athletes.length === 0 ? (
          <p className="text-muted-foreground">No athletes found in this division.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {athletes.map((athlete) => (
              <Card key={athlete.id}>
                <CardHeader>
                  <h2 className="font-semibold">{athlete.name}</h2>
                  <p className="text-sm text-muted-foreground">{athlete.country}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">
                      Record: {athlete.wins}-{athlete.losses}-{athlete.draws}
                    </p>
                    <p className="text-sm">
                      Wins by KO: {athlete.koRate}%
                    </p>
                    <p className="text-sm">
                      Wins by Submission: {athlete.submissionRate}%
                    </p>
                    <p className="text-sm">Followers: {athlete.followers}</p>
                    <p className="text-sm">Rank: {athlete.rank}</p>
                    <p className="text-sm">
                      Pound for Pound Rank: {athlete.poundForPoundRank}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))} 
          </div>
        )}
      </main>
    );
  } catch (error) {
    console.error('Error loading division:', error);
    return notFound();
  }
}