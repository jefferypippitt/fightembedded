import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Calendar, Medal } from "lucide-react";

export default function AboutPage() {
  const features = [
    {
      icon: <Trophy className="w-4 h-4" />,
      title: "Fighter Rankings",
      description:
        "Up-to-date rankings across all weight divisions for both male and female athletes",
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      title: "Event Coverage",
      description:
        "Comprehensive coverage of past and upcoming UFC events",
    },
    {
      icon: <Medal className="w-4 h-4" />,
      title: "Champion Tracking",
      description:
        "Current championship data across all divisions",
    },
  ];

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* About Section */}
      <section className="space-y-3">
        <h1 className="text-2xl font-bold">About Us</h1>
        <p className="text-base text-muted-foreground">
          Deep dive into UFC fighter statistics, performance analytics, athlete
          popularity, and more! Your comprehensive source for UFC fighter data,
          event coverage, and mixed martial arts analysis.
        </p>
      </section>

      {/* Mission Section */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Our Mission</h2>
        <p className="text-muted-foreground">
          We&apos;re dedicated to providing the most accurate and comprehensive
          UFC insights. Our goal is to enhance fight fans&apos; understanding of
          the sport through data-driven analysis.
        </p>
      </section>

      {/* Features Grid */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <Card key={index} className="p-6">
              <CardContent className="space-y-4 p-0">
                <div className="text-primary">{feature.icon}</div>
                <h3 className="font-medium">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Update Frequency */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Stay Updated</h2>
        <p className="text-muted-foreground">
          Our data is updated daily before and after events to ensure you always
          have access to the most current information.
        </p>
      </section>
    </main>
  );
}
