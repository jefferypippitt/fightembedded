import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, TrendingUp, Flag, PlusCircle, Calendar } from "lucide-react";
import Link from "next/link";
import { getDashboardStats } from "@/server/actions/get-dashboard-stats";
import { getTopAthletes } from "@/server/actions/get-top-athletes";
import { getDivisionStats } from "@/server/actions/get-division-stats";
import { getCountryStats } from "@/server/actions/get-country-stats";

export default async function Dashboard() {
  const dashboardStats = await getDashboardStats();
  const topAthletes = await getTopAthletes();
  const divisionStats = await getDivisionStats();
  const countryStats = await getCountryStats();

  const stats = [
    {
      title: "Total Athletes",
      value: dashboardStats.totalAthletes.value.toString(),
      change: dashboardStats.totalAthletes.change,
      trend: "up",
      icon: Users,
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8">
        {/* Header with Add Buttons */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/dashboard/new-athlete">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Athlete
              </Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/events/new">
                <Calendar className="mr-2 h-4 w-4" />
                Add New Event
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid gap-4 md:grid-cols-1 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="inline-flex items-center text-green-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {stat.change} from last month
                    </span>
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Top Athletes Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Top Performing Athletes</CardTitle>
            <CardDescription>Athletes with highest win rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {topAthletes.map((athlete) => (
                <div key={athlete.name} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {athlete.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {athlete.weightDivision} • {athlete.country}
                    </p>
                  </div>
                  <div className="ml-auto text-sm">
                    <span className="font-medium">{`${athlete.wins}-${athlete.losses}`}</span>
                    <span className="text-muted-foreground ml-2">
                      
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

         {/* Upcoming Events Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Next scheduled UFC events</CardDescription>
          </CardHeader>
          <CardContent>
            
          </CardContent>
        </Card>
      </div>

        {/* Additional Stats */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Weight Division Distribution</CardTitle>
              <CardDescription>Athletes per weight class</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {divisionStats.map((division) => (
                  <div key={division.division} className="flex items-center">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {division.division}
                      </p>
                      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${division.percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="ml-4">
                      <span className="text-sm font-medium text-muted-foreground">
                        {division.count} athletes
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Countries</CardTitle>
              <CardDescription>Athletes by country of origin</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {countryStats.map((country) => (
                  <div key={country.country} className="flex items-center">
                    <div className="flex-1">
                      <p className="text-sm font-medium leading-none">
                        {country.country}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {country.count} athletes
                      </p>
                    </div>
                    <div className="ml-4">
                      <Flag className="h-4 w-4 text-muted-foreground" />
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
