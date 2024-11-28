import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TrendingUp,
  PlusCircle,
  Calendar,
  Users,

} from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getDashboardStats } from "@/server/actions/get-dashboard-stats";

export default async function Dashboard() {
  const {
    totalAthletes,
    divisionStats,
    topAthletes,
    newAthletes,
    recentAthletes,
  } = await getDashboardStats();

  const stats = [
    {
      title: "Total Athletes",
      value: totalAthletes.value,
      change: totalAthletes.change,
      trend: totalAthletes.trend,
      icon: Users,
    },
    {
      title: "New Athletes",
      value: newAthletes.value,
      change: newAthletes.change,
      trend: newAthletes.trend,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="py-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Dashboard Overview</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/new-athlete">
              <PlusCircle className="h-4 w-4 mr-1" />
              Add Athlete
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/dashboard/events/new">
              <Calendar className="h-4 w-4 mr-1" />
              Add Event
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {stats.map((stat) => {
          return (
            <Card key={stat.title} className="hover:shadow-sm">
              <CardContent className="pt-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-medium text-gray-500">{stat.title}</p>
                    <h3 className="text-lg font-bold mt-1">{stat.value}</h3>
                  </div>
                
                </div>
          
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {/* Weight Divisions */}
          <Card className="overflow-hidden">
            <CardHeader className="p-4">
              <CardTitle className="text-base">Weight Division Distribution</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <ScrollArea className="h-[300px]">
                <div className="space-y-3">
                  {divisionStats.map((division) => (
                    <div key={division.division}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{division.division}</span>
                        <span className="text-xs text-gray-500">{division.count}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${division.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Recent Athletes */}
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base">Recent Athletes</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-2">
                {recentAthletes.map((athlete) => (
                  <div key={athlete.name} className="flex items-center justify-between p-2 border-b last:border-0">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{athlete.name}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{athlete.weightDivision}</span>
                        <span>•</span>
                        <span>{new Date(athlete.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Athletes */}
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-base">Top Athletes</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-2">
              {topAthletes.map((athlete) => (
                <div key={athlete.name} className="p-2 rounded bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{athlete.name}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                        <span>{athlete.weightDivision}</span>
                        <span>•</span>
                        <span>{athlete.country}</span>
                      </div>
                    </div>
                    <div className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                      {athlete.winRate}% WR ({athlete.wins}-{athlete.losses})
                    </div>
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