import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Calendar, Trophy, Clock } from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getDashboardStats } from "@/server/actions/get-dashboard-stats";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default async function Dashboard() {
  const {
    totalAthletes,
    divisionStats,
    topAthletes,
    recentAthletes,
  } = await getDashboardStats();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="py-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-xl font-bold">Dashboard Overview</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/new-athlete" className="flex items-center">
              <PlusCircle className="h-4 w-4 mr-1" />
              Add Athlete
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/dashboard/events/new" className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Add Event
            </Link>
          </Button>
        </div>
      </div>

      {/* Total Athletes Card */}
      <Card className="border shadow-sm">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Athletes</p>
              <p className="text-2xl font-bold">{totalAthletes.value}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {/* Weight Divisions */}
          <Card>
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Weight Divisions</CardTitle>
                <Badge variant="secondary" className="text-xs">{divisionStats.length}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <ScrollArea className="h-[250px] pr-4">
                <div className="space-y-3">
                  {divisionStats.map((division) => (
                    <div key={division.division} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{division.division}</span>
                        <span className="text-xs text-muted-foreground">{division.count}</span>
                      </div>
                      <Progress value={parseInt(division.percentage)} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Recent Athletes */}
          <Card>
            <CardHeader className="py-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm font-medium">Recent Athletes</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {recentAthletes.map((athlete) => (
                  <div key={athlete.name} className="p-2 rounded-md bg-muted">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{athlete.name}</p>
                      <Badge variant="outline" className="text-xs">{formatDate(athlete.createdAt)}</Badge>
                    </div>
                    <Badge className="mt-1.5 text-xs">{athlete.weightDivision}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Athletes */}
        <Card>
          <CardHeader className="py-3">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {topAthletes.map((athlete) => (
                <div key={athlete.name} className="p-2 rounded-md bg-muted">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm font-medium">{athlete.name}</p>
                    <span className="text-xs text-muted-foreground">{athlete.wins}-{athlete.losses}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className="text-xs">{athlete.weightDivision}</Badge>
                    <Badge variant="secondary" className="text-xs">{athlete.winRate}% WR</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}