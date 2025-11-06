import { Metadata } from "next";
import { Suspense } from "react";
import { LastUpdatedDate } from "@/components/last-updated-date";

export const metadata: Metadata = {
  title: "About Fight Embedded",
  description: "A personal UFC website for athlete stats and rankings",
};

export default function AboutPage() {
  return (
    <article className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
          About Fight Embedded
        </h1>
        <p className="text-sm text-muted-foreground">
          Last updated:{" "}
          <Suspense fallback={<span>—</span>}>
            <LastUpdatedDate />
          </Suspense>
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">My Mission</h2>
        <p className="text-sm text-muted-foreground">
          As a passionate UFC fan and developer, I created Fight Embedded to
          provide accurate, up-to-date statistics and analytics for UFC
          athletes.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">What I Offer</h2>
        <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
          <li>Personal collection of athlete statistics and records</li>
          <li>Division-specific rankings and analytics</li>
          <li>Career performance metrics</li>
          <li>Regular updates on athlete status</li>
          <li>Simple comparison tools</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">Data Accuracy</h2>
        <p className="text-sm text-muted-foreground">
          I maintain high standards for data accuracy and regularly update the
          database with the latest information from official UFC sources. As a
          solo developer, I work diligently to ensure all statistics and
          rankings are current and reliable.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">Contact Me</h2>
        <p className="text-sm">
          Have questions or suggestions? I&apos;d love to hear from you. Reach
          out at{" "}
          <span className="text-blue-500 dark:text-blue-500">
            fightembedded@gmail.com
          </span>
        </p>
      </section>
    </article>
  );
}
