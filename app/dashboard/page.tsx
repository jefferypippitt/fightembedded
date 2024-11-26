import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trophy, Users, TrendingUp, Flag, PlusCircle } from "lucide-react";
import Link from "next/link";

export default async function Dashboard() {
  const stats = [
    {
      title: "Total Athletes",
      value: "156",
      change: "+12%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Average Win Rate",
      value: "67.3%",
      change: "+5.2%",
      trend: "up",
      icon: TrendingUp,
    },
    {
      title: "Total Matches",
      value: "1,284",
      change: "+8.1%",
      trend: "up",
      icon: Trophy,
    },
  ];

  const topAthletes = [
    {
      name: "Alex Silva",
      weightDivision: "Lightweight",
      country: "Brazil",
      record: "15-2-0",
      koRate: 60,
    },
    {
      name: "Sarah Thompson",
      weightDivision: "Featherweight",
      country: "USA",
      record: "12-1-0",
      koRate: 75,
    },
    {
      name: "Yuki Tanaka",
      weightDivision: "Welterweight",
      country: "Japan",
      record: "14-3-1",
      koRate: 55,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8">
        {/* Header with Add Button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button asChild>
            <Link href="/dashboard/new-athlete">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Athlete
            </Link>
          </Button>
        </div>

        {/* Stats Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
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
              {topAthletes.map((athlete, index) => (
                <div key={index} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {athlete.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {athlete.weightDivision} • {athlete.country}
                    </p>
                  </div>
                  <div className="ml-auto text-sm">
                    <span className="font-medium">{athlete.record}</span>
                    <span className="text-muted-foreground ml-2">
                      ({athlete.koRate}% KO Rate)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Additional Stats */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Weight Division Distribution</CardTitle>
              <CardDescription>Athletes per weight class</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { division: "Lightweight", count: 45, percentage: 28 },
                  { division: "Welterweight", count: 38, percentage: 24 },
                  { division: "Featherweight", count: 32, percentage: 20 },
                ].map((division) => (
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
                {[
                  { country: "Brazil", count: 42, trend: "up" },
                  { country: "United States", count: 38, trend: "up" },
                  { country: "Japan", count: 25, trend: "stable" },
                ].map((country) => (
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
    </div>
  );
}
