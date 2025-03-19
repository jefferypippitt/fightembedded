import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Fight Embedded",
  description: "Learn about Fight Embedded - Your comprehensive UFC fighter statistics and analytics platform.",
};

export default function AboutPage() {
  return (
    <article className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">About Fight Embedded</h1>
        <p className="text-sm text-muted-foreground">
          Your comprehensive platform for UFC fighter statistics and analytics.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">Our Mission</h2>
        <p className="text-sm text-muted-foreground">
          Fight Embedded is dedicated to providing accurate, up-to-date statistics and analytics for UFC fighters. 
          We aim to enhance the fan experience by offering detailed insights into fighter performance, rankings, and career statistics.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">What We Offer</h2>
        <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
          <li>Comprehensive fighter statistics and records</li>
          <li>Division-specific rankings and analytics</li>
          <li>Career performance metrics</li>
          <li>Real-time updates on fighter status</li>
          <li>Interactive comparison tools</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">Data Accuracy</h2>
        <p className="text-sm text-muted-foreground">
          We maintain high standards for data accuracy and regularly update our database with the latest information 
          from official UFC sources. Our team works diligently to ensure all statistics and rankings are current and reliable.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">Contact Us</h2>
        <p className="text-sm">
          Have questions or suggestions? We&apos;d love to hear from you. Reach out to us at{" "}
          <span className="text-red-600 dark:text-red-400">
            fightembedded@gmail.com
          </span>
        </p>
      </section>
    </article>
  );
} 