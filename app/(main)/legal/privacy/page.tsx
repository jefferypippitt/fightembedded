import { Metadata } from "next";
import { Suspense } from "react";
import { LastUpdatedDate } from "@/components/last-updated-date";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Data handling practices for Fight Embedded.",
};

export default function PrivacyPage() {
  return (
    <article className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">
          Last updated:{" "}
          <Suspense fallback={<span>—</span>}>
            <LastUpdatedDate />
          </Suspense>
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">
          Personal Project
        </h2>
        <p className="text-sm text-muted-foreground">
          This is a personal project designed and maintained by me for personal
          use and sharing with fellow UFC fans. While the site is publicly
          accessible, it&apos;s primarily intended for my own use and reference.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">
          Data Collection
        </h2>
        <p className="text-sm text-muted-foreground">
          I do not collect any personal data from visitors. All statistics and
          information displayed are sourced from public UFC data and are used
          for personal analysis and reference purposes only.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">Disclaimer</h2>
        <p className="text-sm text-muted-foreground">
          This is my personal project for analyzing UFC statistics and events.
          All information is for reference only and should not be used for
          betting or commercial purposes. UFC and related trademarks are
          property of their respective owners.
        </p>
      </section>
    </article>
  );
}
